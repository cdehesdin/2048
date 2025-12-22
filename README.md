## FunPlay

Création du mini-jeu 2048 avec un bot capable de remporter les parties, réalisé dans le cadre d’un projet personnel et, conçus en HTML, CSS et JavaScript.

> Site web : [https://cdehesdin.github.io/FunPlay](https://cdehesdin.github.io/FunPlay).

[2048](https://play2048.co/) est un jeu vidéo de type puzzle, variante du *jeu de taquin*. Il a été développé par [Gabriele Cirulli](http://gabrielecirulli.com/) en 2014 (19 ans à l’époque) et publié en ligne sous licence libre.

#### Les règles du jeu

Le jeu se joue sur un plateau $4×4$ où chaque case est soit vide, soit contient une puissance de $2$, inscrite sur une tuile. Le joueur peut déplacer les tuiles en les faisant glisser toutes ensemble dans une même direction (haut, bas, droite, gauche). Les tuiles ne peuvent dépasser les bords du plateau. Si deux tuiles de même valeur ($2^k$) sont adjacentes pendant le glissement,
alors elles se combinent en une unique tuile étiquetée par la somme des valeurs ($2^{k+1}$). Chaque combinaison de tuiles rapporte au joueur un nombre de points équivalent à la valeur de la tuile après la combinaison. Après chaque déplacement, une nouvelle tuile apparaît aléatoirement sur un des emplacements vides. Cette nouvelle tuile a pour valeur soit $2$, soit $4$, avec probabilités respectives $\frac{9}{10}$ et $\frac{1}{10}$. Le jeu débute avec deux tuiles posées sur le plateau, tirées selon les probabilités mentionnées
ci-dessus.

Le but du jeu est de créer une tuile portant le numéro 2048. Cependant, on pourra continuer à jouer après avoir atteint le but, en créant des tuiles avec des numéros plus grands et ainsi améliorer son score. Le jeu se termine lorsque toutes les tuiles sont occupées et que plus aucun mouvement ne permet de combiner de tuiles.
