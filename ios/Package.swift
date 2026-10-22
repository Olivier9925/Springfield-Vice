// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "SpringfieldViceCore",
    products: [.library(name: "SpringfieldViceCore", targets: ["SpringfieldViceCore"])],
    targets: [
        .target(name: "SpringfieldViceCore", path: "SpringfieldVice/Core"),
        .testTarget(name: "SpringfieldViceCoreTests", dependencies: ["SpringfieldViceCore"], path: "Tests")
    ]
)
