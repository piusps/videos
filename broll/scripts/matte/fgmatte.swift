import Foundation
import AVFoundation
import Vision
import CoreImage
// usage: fgmatte <in.mp4> <out.gray> <W> <H>  -> raw 8-bit gray foreground masks (VNGenerateForegroundInstanceMaskRequest), full res
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
var n = 0
var last = [UInt8](repeating: 255, count: W * H)
while let sb = out.copyNextSampleBuffer() {
  guard let pb = CMSampleBufferGetImageBuffer(sb) else { continue }
  let req = VNGenerateForegroundInstanceMaskRequest()
  let h = VNImageRequestHandler(cvPixelBuffer: pb, options: [:])
  var buf = last
  if (try? h.perform([req])) != nil, let r = req.results?.first, !r.allInstances.isEmpty,
     let m = try? r.generateScaledMaskForImage(forInstances: r.allInstances, from: h) {
    let ci = CIImage(cvPixelBuffer: m)
    ci.extent.width == CGFloat(W) ? () : ()
    var f = [Float](repeating: 0, count: W * H)
    ctx.render(ci, toBitmap: &f, rowBytes: W * 4, bounds: CGRect(x: 0, y: 0, width: W, height: H), format: .Lf, colorSpace: nil)
    for i in 0..<(W * H) { buf[i] = UInt8(max(0, min(255, f[i] * 255))) }
    last = buf
  }
  fh.write(Data(buf)); n += 1
  if n % 100 == 0 { FileHandle.standardError.write("\(n)\n".data(using: .utf8)!) }
}
fh.closeFile(); FileHandle.standardError.write("frames \(n)\n".data(using: .utf8)!)
