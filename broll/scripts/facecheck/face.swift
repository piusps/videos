import Foundation
import Vision
import AppKit
// usage: face <png>...  -> prints "file x y w h" in top-left pixel coords (largest face) or "file none"
for path in CommandLine.arguments.dropFirst() {
  guard let img = NSImage(contentsOfFile: path), let cg = img.cgImage(forProposedRect: nil, context: nil, hints: nil) else { print("\(path) err"); continue }
  let req = VNDetectFaceRectanglesRequest()
  try? VNImageRequestHandler(cgImage: cg, options: [:]).perform([req])
  let W = Double(cg.width), H = Double(cg.height)
  if let f = (req.results ?? []).max(by: { $0.boundingBox.width < $1.boundingBox.width }) {
    let b = f.boundingBox
    print(String(format: "%@ %.0f %.0f %.0f %.0f", path, b.minX*W, (1-b.maxY)*H, b.width*W, b.height*H))
  } else { print("\(path) none") }
}
