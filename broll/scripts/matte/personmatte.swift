import Foundation
import AVFoundation
import Vision
import CoreImage
// usage: personmatte <in.mp4> <out.gray> <W> <H>  -> raw 8-bit gray person masks, one per frame, scaled to WxH
let a = CommandLine.arguments
let asset = AVURLAsset(url: URL(fileURLWithPath: a[1]))
let W = Int(a[3])!, H = Int(a[4])!
let track = asset.tracks(withMediaType: .video)[0]
let reader = try! AVAssetReader(asset: asset)
let out = AVAssetReaderTrackOutput(track: track, outputSettings: [kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_32BGRA])
reader.add(out); reader.startReading()
FileManager.default.createFile(atPath: a[2], contents: nil)
let fh = FileHandle(forWritingAtPath: a[2])!
let ctx = CIContext()
let req = VNGeneratePersonSegmentationRequest()
req.qualityLevel = .accurate
req.outputPixelFormat = kCVPixelFormatType_OneComponent8
var n = 0
while let sb = out.copyNextSampleBuffer() {
  guard let pb = CMSampleBufferGetImageBuffer(sb) else { continue }
  try! VNImageRequestHandler(cvPixelBuffer: pb, options: [:]).perform([req])
  let mask = req.results!.first!.pixelBuffer
  var ci = CIImage(cvPixelBuffer: mask)
  ci = ci.transformed(by: CGAffineTransform(scaleX: CGFloat(W) / ci.extent.width, y: CGFloat(H) / ci.extent.height))
  var buf = [UInt8](repeating: 0, count: W * H)
  ctx.render(ci, toBitmap: &buf, rowBytes: W, bounds: CGRect(x: 0, y: 0, width: W, height: H), format: .L8, colorSpace: nil)
  fh.write(Data(buf)); n += 1
}
fh.closeFile(); FileHandle.standardError.write("frames \(n)\n".data(using: .utf8)!)
