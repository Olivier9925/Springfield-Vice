# Springfield Vice — iOS natif

Première adaptation en **Swift 5, SwiftUI et SpriteKit**, sans WebView ni dépendance externe. Le jeu React reste dans `../springfield_vice/` et n’est pas modifié.

## Ouvrir et lancer

1. Sur un **Mac avec Xcode 15 ou supérieur**, ouvrir `SpringfieldVice.xcodeproj`.
2. Sélectionner le schéma **SpringfieldVice**, puis un simulateur iPhone ou iPad avec **iOS 16 ou supérieur**.
3. Lancer avec **⌘R**. L’application utilise le mode paysage.
4. Pour un appareil physique, choisir votre équipe dans **Signing & Capabilities** et remplacer `com.example.SpringfieldVice` par votre identifiant d’application.

Pas de serveur, de clé, de gestionnaire de dépendances ou d’installation npm pour la version iOS.

## Ce qui est implémenté

- Accueil, options, effets sonores locaux, record persistant de donuts ramassés.
- Joystick tactile, déplacement dans les deux axes, animation d’Homer et des personnages.
- Parcours défilant de 6 200 unités, donuts, Duff, obstacles et adversaires.
- 200 secondes, trois points de santé initiaux, soins plafonnés à six, dix donuts initiaux.
- Tirs directionnels consommant un donut ; cible la plus proche devant Homer dans une portée de 500 unités.
- Victoire en rejoignant Bart, défaite à zéro santé ou temps écoulé, pause/reprise, nouvelle partie et retour à l’accueil.
- Pause automatique quand l’application devient inactive ; reprise explicite.

Il s’agit d’une première version jouable à valider sur iOS, pas d’un port identique : le parcours est déterministe, Bart attend à la fin, les collisions et les tirs ont des règles explicites. La musique distante du jeu web n’est pas intégrée ; seuls les deux effets WAV locaux sont repris. Pas de classement en ligne ni de prise en charge VoiceOver complète des commandes du jeu.

## Architecture

- `SpringfieldViceApp.swift` : écrans SwiftUI, commandes et cycle de vie.
- `GameScene.swift` : affichage SpriteKit, caméra, sprites, animations et sons.
- `Core/GameState.swift` : simulation indépendante de SwiftUI/SpriteKit.
- `Tests/GameStateTests.swift` : six tests des règles avec Swift Package Manager.
- `Resources/` : copies des ressources du jeu React, chargées hors ligne.

Les graphismes et sons sont ceux du dépôt d’origine. Leur copie ne confère aucun droit de distribution supplémentaire ; vérifier les droits avant toute publication sur l’App Store.

## Validation sur Mac

Depuis le dossier `ios/` :

```sh
swift test
xcodebuild -project SpringfieldVice.xcodeproj -scheme SpringfieldVice \
  -sdk iphonesimulator -configuration Debug \
  -derivedDataPath DerivedData CODE_SIGNING_ALLOWED=NO build
```

Vérifier dans le simulateur : accueil → jouer → déplacement/ramassage → tir → pause/reprise → retour accueil → nouvelle partie. Vérifier aussi la pause après passage en arrière-plan, le son désactivé, la victoire et la défaite. Tester sur iPhone et iPad, avec les deux orientations paysage.

L’environnement cloud de création est Linux et ne fournit ni Swift ni Xcode. Les sources, références du projet et ressources peuvent y être inspectées, mais **la compilation Swift, les six tests et l’exécution iOS n’y ont pas été validés**. Les contrôles React précédents ne valident pas cette version native.
