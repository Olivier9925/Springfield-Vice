import SwiftUI
import SpriteKit

@main
struct SpringfieldViceApp: App {
    var body: some Scene {
        WindowGroup { ContentView().preferredColorScheme(.dark) }
    }
}

final class GameSession: ObservableObject {
    @Published var playing = false
    @Published var snapshot = GameState()
    let scene = GameScene()

    init() {
        scene.onChange = { [weak self] in self?.snapshot = $0 }
    }

    func start() {
        scene.restart()
        playing = true
    }

    func home() {
        scene.pauseGame()
        playing = false
    }
}

struct ContentView: View {
    @StateObject private var session = GameSession()
    @Environment(\.scenePhase) private var scenePhase
    @AppStorage("soundEnabled") private var soundEnabled = true
    @AppStorage("bestDonuts") private var bestDonuts = 0
    @State private var settings = false
    private let pink = Color(red: 1, green: 0.16, blue: 0.65)

    var body: some View {
        GeometryReader { geometry in
            ZStack {
                Color(red: 0.08, green: 0.02, blue: 0.14).ignoresSafeArea()
                if session.playing {
                    SpriteView(scene: session.scene)
                        .aspectRatio(16 / 9, contentMode: .fit)
                        .frame(maxWidth: .infinity, maxHeight: .infinity)
                    VStack {
                        HStack(spacing: 20) {
                            Label("\(session.snapshot.health)", systemImage: "heart.fill").foregroundStyle(.pink)
                            Text("🍩 \(session.snapshot.donuts)")
                            Label("\(Int(ceil(session.snapshot.remaining)))", systemImage: "timer")
                            Spacer()
                            Button { session.scene.pauseGame() } label: {
                                Image(systemName: "pause.fill").padding(10)
                            }.accessibilityLabel("Mettre en pause")
                        }
                        .font(.system(.title3, design: .monospaced).bold())
                        .padding(12).background(.black.opacity(0.75), in: RoundedRectangle(cornerRadius: 16))
                        Spacer()
                        if session.snapshot.phase == .playing {
                            HStack(alignment: .bottom) {
                                Joystick { session.scene.input = $0 }
                                Spacer()
                                Button { session.scene.fire() } label: {
                                    VStack {
                                        Image(systemName: "scope").font(.largeTitle)
                                        Text("LANCER").font(.caption.bold())
                                    }
                                    .frame(width: 90, height: 90)
                                    .background(pink.opacity(0.85), in: Circle())
                                    .overlay(Circle().stroke(.white.opacity(0.6), lineWidth: 2))
                                }
                                .accessibilityLabel("Lancer un donut")
                                .disabled(session.snapshot.donuts == 0)
                            }
                        }
                    }.padding(20)
                    if session.snapshot.phase != .playing { gameOverlay }
                } else {
                    HStack(spacing: 32) {
                        Image("homerjumping").resizable().scaledToFit()
                            .frame(maxWidth: geometry.size.width * 0.3, maxHeight: geometry.size.height * 0.7)
                            .accessibilityHidden(true)
                        VStack(spacing: 16) {
                            Image("springfieldvice").resizable().scaledToFit().frame(maxWidth: 380, maxHeight: 130)
                                .accessibilityLabel("Springfield Vice")
                            Text("BART vs HOMER").font(.system(.title2, design: .monospaced).bold()).foregroundStyle(pink)
                            Text("Rattrape Bart avant la fin des 200 secondes.")
                            Text("Record : \(bestDonuts) donuts ramassés").foregroundStyle(.secondary)
                            Button("JOUER") { session.start() }.buttonStyle(ArcadeButton(color: pink))
                            Button("OPTIONS ET COMMANDES") { settings = true }
                        }.multilineTextAlignment(.center)
                    }.padding(24)
                }
            }
            .foregroundStyle(.white)
        }
        .sheet(isPresented: $settings) {
            NavigationStack {
                Form {
                    Toggle("Effets sonores", isOn: $soundEnabled)
                    Section("Comment jouer") {
                        Text("Déplace le joystick à gauche pour guider Homer dans les rues. Ramasse les donuts pour recharger tes tirs et les Duff pour récupérer de la santé.")
                        Text("Le bouton LANCER élimine l’obstacle ou l’adversaire le plus proche devant Homer. Évite les collisions et rejoins Bart au bout du parcours avant la fin du temps.")
                    }
                    Section("Record") { Text("\(bestDonuts) donuts ramassés") }
                }
                .navigationTitle("Options")
                .toolbar { ToolbarItem(placement: .confirmationAction) { Button("Fermer") { settings = false } } }
            }
        }
        .onAppear { session.scene.soundEnabled = soundEnabled }
        .onChange(of: soundEnabled) { session.scene.soundEnabled = $0 }
        .onChange(of: scenePhase) { if $0 != .active { session.scene.pauseGame() } }
        .onChange(of: session.snapshot.collected) { bestDonuts = max(bestDonuts, $0) }
        .persistentSystemOverlays(.hidden)
    }

    private var gameOverlay: some View {
        ZStack {
            Color.black.opacity(0.8).ignoresSafeArea()
            VStack(spacing: 18) {
                Text(session.snapshot.phase == .paused ? "PAUSE" :
                    session.snapshot.phase == .won ? "BART EST RATTRAPÉ !" : "GAME OVER")
                    .font(.system(.largeTitle, design: .monospaced).bold())
                Text("\(session.snapshot.collected) donuts ramassés")
                if session.snapshot.phase == .paused {
                    Button("REPRENDRE") { session.scene.resumeGame() }.buttonStyle(ArcadeButton(color: pink))
                }
                HStack(spacing: 24) {
                    Button("REJOUER") { session.start() }
                    Button("ACCUEIL") { session.home() }
                }
                Toggle("Effets sonores", isOn: $soundEnabled).frame(maxWidth: 260)
            }.padding()
        }
    }
}

private struct ArcadeButton: ButtonStyle {
    let color: Color
    func makeBody(configuration: Configuration) -> some View {
        configuration.label.font(.title3.bold()).padding(.horizontal, 36).padding(.vertical, 12)
            .background(color.opacity(configuration.isPressed ? 0.6 : 1), in: Capsule())
            .scaleEffect(configuration.isPressed ? 0.96 : 1)
    }
}

private struct Joystick: View {
    var onMove: (Vector) -> Void
    @State private var offset = CGSize.zero
    private let radius: CGFloat = 42

    var body: some View {
        ZStack {
            Circle().fill(.black.opacity(0.5)).overlay(Circle().stroke(.white.opacity(0.4), lineWidth: 2))
            Circle().fill(.white.opacity(0.75)).frame(width: 48, height: 48).offset(offset)
        }
        .frame(width: 130, height: 130)
        .contentShape(Circle())
        .gesture(DragGesture(minimumDistance: 0)
            .onChanged { value in
                let dx = value.location.x - 65
                let dy = value.location.y - 65
                let length = max(radius, hypot(dx, dy))
                offset = CGSize(width: dx / length * radius, height: dy / length * radius)
                onMove(Vector(x: Double(dx / length), y: Double(-dy / length)))
            }
            .onEnded { _ in offset = .zero; onMove(.zero) })
        .onDisappear { offset = .zero; onMove(.zero) }
        .accessibilityLabel("Joystick de déplacement")
    }
}
