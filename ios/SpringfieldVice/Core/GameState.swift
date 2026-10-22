import Foundation

struct Vector: Equatable {
    var x: Double
    var y: Double
    static let zero = Vector(x: 0, y: 0)
}

struct WorldItem: Identifiable {
    enum Kind { case donut, beer, barrel, enemy }
    let id: Int
    let kind: Kind
    var position: Vector
    var active = true
}

/// Platform-independent rules. Coordinates describe the feet of each character.
struct GameState {
    enum Phase: Equatable { case playing, paused, won, lost }
    static let worldWidth = 6_200.0
    var phase: Phase = .playing
    var player = Vector(x: 160, y: 220)
    var remaining = 200.0
    var health = 3
    var donuts = 10
    var collected = 0
    var facing = 1.0
    var invulnerability = 0.0
    var shotCooldown = 0.0
    var bart = Vector(x: 6_000, y: 240)
    var items: [WorldItem]

    init() {
        // A repeatable course makes balancing and regression checks reproducible.
        var course: [WorldItem] = []
        for index in 0..<28 {
            course.append(WorldItem(id: index, kind: .donut,
                position: Vector(x: 350 + Double(index) * 195, y: 170 + Double(index % 4) * 45)))
        }
        for index in 0..<9 {
            course.append(WorldItem(id: 100 + index, kind: .beer,
                position: Vector(x: 650 + Double(index) * 590, y: 210 + Double(index % 3) * 40)))
        }
        for index in 0..<16 {
            course.append(WorldItem(id: 200 + index, kind: index % 3 == 0 ? .enemy : .barrel,
                position: Vector(x: 850 + Double(index) * 310, y: 170 + Double(index % 4) * 45)))
        }
        items = course
    }

    mutating func pause() {
        if phase == .playing { phase = .paused }
    }

    mutating func resume() {
        if phase == .paused { phase = .playing }
    }

    mutating func advance(seconds: Double, input: Vector) {
        guard phase == .playing, seconds.isFinite, seconds > 0 else { return }
        // Bound simulation steps after interrupted frames; backgrounding pauses the game.
        let dt = min(seconds, 0.05)
        remaining = max(0, remaining - dt)
        invulnerability = max(0, invulnerability - dt)
        shotCooldown = max(0, shotCooldown - dt)
        let magnitude = max(1, hypot(input.x, input.y))
        let dx = input.x / magnitude
        let dy = input.y / magnitude
        player.x = min(Self.worldWidth - 50, max(50, player.x + dx * 240 * dt))
        player.y = min(340, max(150, player.y + dy * 170 * dt))
        if abs(dx) > 0.05 { facing = dx < 0 ? -1 : 1 }

        for index in items.indices where items[index].active {
            if items[index].kind == .enemy {
                let direction = items[index].id % 2 == 0 ? 1.0 : -1.0
                items[index].position.y = min(340, max(150,
                    items[index].position.y + sin(remaining * 2) * direction * 35 * dt))
            }
            let item = items[index]
            guard abs(player.x - item.position.x) < 35,
                  abs(player.y - item.position.y) < 28 else { continue }
            switch item.kind {
            case .donut:
                donuts += 1
                collected += 1
                items[index].active = false
            case .beer:
                health = min(6, health + 1)
                items[index].active = false
            case .barrel, .enemy:
                if invulnerability == 0 {
                    health -= 1
                    invulnerability = 1.2
                    items[index].active = false
                }
            }
        }
        if health <= 0 || remaining == 0 {
            phase = .lost
        } else if abs(player.x - bart.x) < 50 && abs(player.y - bart.y) < 45 {
            phase = .won
        }
    }

    /// Returns whether a donut was fired. A shot consumes one even when it misses.
    @discardableResult
    mutating func shoot() -> Bool {
        guard phase == .playing, donuts > 0, shotCooldown == 0 else { return false }
        donuts -= 1
        shotCooldown = 0.3
        let target = items.indices.filter {
            let item = items[$0]
            let distance = (item.position.x - player.x) * facing
            return item.active && (item.kind == .barrel || item.kind == .enemy)
                && distance > 0 && distance < 500 && abs(item.position.y - player.y) < 40
        }.min { abs(items[$0].position.x - player.x) < abs(items[$1].position.x - player.x) }
        if let target = target { items[target].active = false }
        return true
    }
}
