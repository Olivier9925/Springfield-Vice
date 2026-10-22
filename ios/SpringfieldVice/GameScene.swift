import SpriteKit

final class GameScene: SKScene {
    var state = GameState()
    var input = Vector.zero
    var soundEnabled = true
    var onChange: ((GameState) -> Void)?
    private let world = SKNode()
    private var hero = SKSpriteNode()
    private var itemNodes: [Int: SKSpriteNode] = [:]
    private var previousTime: TimeInterval?
    private var hudTime = 0.0
    private var wasMoving = false

    init() {
        super.init(size: CGSize(width: 960, height: 540))
        scaleMode = .aspectFit
        backgroundColor = SKColor(red: 0.12, green: 0.03, blue: 0.2, alpha: 1)
    }

    required init?(coder aDecoder: NSCoder) { fatalError("Use init()") }

    override func didMove(to view: SKView) {
        if world.parent == nil { buildWorld() }
        previousTime = nil
    }

    func restart() {
        state = GameState()
        input = .zero
        previousTime = nil
        hudTime = 0
        wasMoving = false
        buildWorld()
        onChange?(state)
    }

    func pauseGame() {
        state.pause()
        input = .zero
        world.isPaused = true
        onChange?(state)
    }

    func resumeGame() {
        state.resume()
        world.isPaused = state.phase != .playing
        previousTime = nil
        onChange?(state)
    }

    func fire() {
        guard state.shoot() else { return }
        let shot = sprite("donut", height: 25)
        shot.position = CGPoint(x: state.player.x, y: state.player.y + 50)
        shot.zPosition = 1_000
        world.addChild(shot)
        shot.run(.sequence([
            .moveBy(x: 500 * state.facing, y: 0, duration: 0.25), .removeFromParent()
        ]))
        refreshSprites()
        onChange?(state)
    }

    private func sprite(_ name: String, height: CGFloat) -> SKSpriteNode {
        let texture = SKTexture(imageNamed: name)
        texture.filteringMode = .nearest
        let node = SKSpriteNode(texture: texture)
        let textureSize = texture.size()
        node.size = CGSize(width: height * textureSize.width / max(1, textureSize.height), height: height)
        node.anchorPoint = CGPoint(x: 0.5, y: 0)
        return node
    }

    private func frames(_ name: String, count: Int) -> [SKTexture] {
        let sheet = SKTexture(imageNamed: name)
        return (0..<count).map { index in
            let frame = SKTexture(rect: CGRect(x: CGFloat(index) / CGFloat(count), y: 0,
                width: 1 / CGFloat(count), height: 1), in: sheet)
            frame.filteringMode = .nearest
            return frame
        }
    }

    private func buildWorld() {
        removeAllChildren()
        world.removeAllChildren()
        world.isPaused = false
        itemNodes.removeAll()
        addChild(world)
        let backdrop = SKSpriteNode(imageNamed: "background_80s_repeat")
        backdrop.anchorPoint = .zero
        backdrop.size = CGSize(width: GameState.worldWidth, height: 310)
        backdrop.position = CGPoint(x: 0, y: 230)
        backdrop.zPosition = -1_000
        world.addChild(backdrop)
        let street = SKSpriteNode(color: SKColor(red: 0.22, green: 0.04, blue: 0.22, alpha: 1),
            size: CGSize(width: GameState.worldWidth, height: 350))
        street.anchorPoint = .zero
        street.zPosition = -900
        world.addChild(street)
        for y in stride(from: 150, through: 340, by: 45) {
            let line = SKSpriteNode(color: SKColor.magenta.withAlphaComponent(0.3),
                size: CGSize(width: GameState.worldWidth, height: 1))
            line.anchorPoint = .zero
            line.position.y = CGFloat(y)
            line.zPosition = -800
            world.addChild(line)
        }

        hero = sprite("homerspritestand", height: 110)
        world.addChild(hero)
        let bart = SKSpriteNode(texture: frames("bartwalking", count: 6)[0])
        bart.size = CGSize(width: 65, height: 65)
        bart.anchorPoint = CGPoint(x: 0.5, y: 0)
        bart.position = CGPoint(x: state.bart.x, y: state.bart.y)
        bart.zPosition = 540 - bart.position.y
        bart.run(.repeatForever(.animate(with: frames("bartwalking", count: 6), timePerFrame: 0.12)))
        world.addChild(bart)

        for item in state.items {
            let node: SKSpriteNode
            switch item.kind {
            case .donut: node = sprite("donut", height: 28)
            case .beer: node = sprite("duffpix", height: 40)
            case .barrel: node = sprite("barrel", height: 55)
            case .enemy:
                let names = ["selma", "seymour", "milhouse", "grandpa"]
                let counts = [6, 6, 7, 6]
                let index = item.id % names.count
                let textures = frames(names[index], count: counts[index])
                node = SKSpriteNode(texture: textures[0])
                node.anchorPoint = CGPoint(x: 0.5, y: 0)
                node.size = CGSize(width: 55, height: 80)
                node.run(.repeatForever(.animate(with: textures, timePerFrame: 0.16)))
            }
            world.addChild(node)
            itemNodes[item.id] = node
        }
        refreshSprites()
    }

    private func refreshSprites() {
        hero.position = CGPoint(x: state.player.x, y: state.player.y)
        hero.zPosition = 540 - hero.position.y
        hero.xScale = state.facing
        hero.alpha = state.invulnerability > 0 ? 0.5 : 1
        let moving = abs(input.x) + abs(input.y) > 0.1 && state.phase == .playing
        if moving != wasMoving {
            hero.removeAction(forKey: "walk")
            if moving {
                hero.run(.repeatForever(.animate(with: frames("homersprite", count: 9),
                    timePerFrame: 0.08)), withKey: "walk")
            } else {
                hero.texture = SKTexture(imageNamed: "homerspritestand")
            }
            wasMoving = moving
        }
        world.position.x = -min(GameState.worldWidth - 960, max(0, state.player.x - 300))
        for item in state.items {
            guard let node = itemNodes[item.id] else { continue }
            node.isHidden = !item.active
            node.position = CGPoint(x: item.position.x, y: item.position.y)
            node.zPosition = 540 - node.position.y
        }
    }

    override func update(_ currentTime: TimeInterval) {
        defer { previousTime = currentTime }
        guard let previousTime, state.phase == .playing else { return }
        let oldHealth = state.health
        let oldCollected = state.collected
        state.advance(seconds: currentTime - previousTime, input: input)
        if soundEnabled {
            if state.health < oldHealth { run(.playSoundFileNamed("oups.wav", waitForCompletion: false)) }
            if state.collected > oldCollected { run(.playSoundFileNamed("noproblemo.wav", waitForCompletion: false)) }
        }
        refreshSprites()
        hudTime += currentTime - previousTime
        if hudTime >= 0.1 || state.phase != .playing {
            hudTime = 0
            onChange?(state)
        }
        if state.phase != .playing { world.isPaused = true; input = .zero }
    }
}
