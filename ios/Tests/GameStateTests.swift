import XCTest
@testable import SpringfieldViceCore

final class GameStateTests: XCTestCase {
    func testPauseFreezesMovementAndCountdown() {
        var game = GameState()
        game.pause()
        game.advance(seconds: 0.05, input: Vector(x: 1, y: 1))
        XCTAssertEqual(game.player, Vector(x: 160, y: 220))
        XCTAssertEqual(game.remaining, 200)
        game.resume()
        game.advance(seconds: 0.05, input: Vector(x: 1, y: 0))
        XCTAssertGreaterThan(game.player.x, 160)
        XCTAssertLessThan(game.remaining, 200)
    }

    func testCollectingDonutOnlyCountsOnce() {
        var game = GameState()
        game.player = game.items[0].position
        game.advance(seconds: 0.01, input: .zero)
        game.advance(seconds: 0.01, input: .zero)
        XCTAssertEqual(game.donuts, 11)
        XCTAssertEqual(game.collected, 1)
    }

    func testShotConsumesAmmoAndHitsOnlyNearestTargetAhead() {
        var game = GameState()
        game.items = [
            WorldItem(id: 1, kind: .barrel, position: Vector(x: 250, y: 220)),
            WorldItem(id: 2, kind: .enemy, position: Vector(x: 350, y: 220)),
            WorldItem(id: 3, kind: .enemy, position: Vector(x: 100, y: 220))
        ]
        XCTAssertTrue(game.shoot())
        XCTAssertEqual(game.donuts, 9)
        XCTAssertFalse(game.items[0].active)
        XCTAssertTrue(game.items[1].active)
        XCTAssertTrue(game.items[2].active)
        XCTAssertFalse(game.shoot(), "Cooldown prevents repeated fire in one frame")
        game.shotCooldown = 0
        game.donuts = 0
        XCTAssertFalse(game.shoot())
    }

    func testDamageHasGracePeriodAndBeerRestoresHealth() {
        var game = GameState()
        game.items = [
            WorldItem(id: 1, kind: .barrel, position: game.player),
            WorldItem(id: 2, kind: .barrel, position: game.player),
            WorldItem(id: 3, kind: .beer, position: game.player)
        ]
        game.advance(seconds: 0.01, input: .zero)
        XCTAssertEqual(game.health, 3)
        XCTAssertGreaterThan(game.invulnerability, 0)
        XCTAssertTrue(game.items[1].active)
        XCTAssertFalse(game.items[2].active)
    }

    func testWinLossAndTerminalState() {
        var game = GameState()
        game.player = game.bart
        game.advance(seconds: 0.01, input: .zero)
        XCTAssertEqual(game.phase, .won)
        let time = game.remaining
        game.advance(seconds: 0.01, input: Vector(x: 1, y: 0))
        XCTAssertEqual(game.remaining, time)
        game = GameState()
        game.remaining = 0.005
        game.advance(seconds: 0.01, input: .zero)
        XCTAssertEqual(game.phase, .lost)
        game = GameState()
        game.health = 0
        game.advance(seconds: 0.01, input: .zero)
        XCTAssertEqual(game.phase, .lost)
    }

    func testPlayerStaysInsideCourse() {
        var game = GameState()
        for _ in 0..<500 { game.advance(seconds: 0.05, input: Vector(x: -1, y: -1)) }
        XCTAssertEqual(game.player.x, 50)
        XCTAssertEqual(game.player.y, 150)
    }
}
