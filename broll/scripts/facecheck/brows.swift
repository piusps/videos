import Foundation
import Vision
import AppKit
// usage: brows <png>... -> "file L x,y x,y ... | R x,y ..." eyebrow points in top-left pixel coords, L/R = image left/right
for path in CommandLine.arguments.dropFirst() {
  guard let img = NSImage(contentsOfFile: path), let cg = img.cgImage(forProposedRect: nil, context: nil, hints: nil) else { print("\(path) err"); continue }
  let req = VNDetectFaceLandmarksRequest()
  try? VNImageRequestHandler(cgImage: cg, options: [:]).perform([req])
  let W = Double(cg.width), H = Double(cg.height)
  guard let f = (req.results ?? []).max(by: { $0.boundingBox.width < $1.boundingBox.width }), let lm = f.landmarks,
        let a = lm.leftEyebrow, let b = lm.rightEyebrow else { print("\(path) none"); continue }
  func pts(_ r: VNFaceLandmarkRegion2D) -> [(Double, Double)] {
    r.pointsInImage(imageSize: CGSize(width: W, height: H)).map { (Double($0.x), H - Double($0.y)) }
  }
  var p1 = pts(a), p2 = pts(b)
  let m1 = p1.map { $0.0 }.reduce(0, +) / Double(p1.count), m2 = p2.map { $0.0 }.reduce(0, +) / Double(p2.count)
  if m1 > m2 { swap(&p1, &p2) }
  let s = { (p: [(Double, Double)]) in p.map { String(format: "%.1f,%.1f", $0.0, $0.1) }.joined(separator: " ") }
  print("\(path) L \(s(p1)) | R \(s(p2))")
}
