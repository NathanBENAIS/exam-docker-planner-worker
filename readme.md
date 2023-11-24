# Workers

## Présentation

L'objectif du code fourni est de simuler un pattern <a href="https://en.wikipedia.org/wiki/Master/slave_(technology)">planner/worker</a>.

On a donc 2 serveurs :

- le planner qui gère les tâches à exécuter
- le worker qui exécute les tâches

### Les tâches

Pour éviter de complexifier le code on va seulement faire des multiplications et des additions, le worker prend artificiellement du temps pour simuler un temps de travail.
Les workers ne peuvent pas effectuer plusieurs tâches à la fois, ils renvoient une erreur 403 si on leur donne une nouvelle tâche alors que leur tâche en cours n'est pas fini.

Il est attendu comme rendu de l'examen des fichiers contenant les commandes lancées (fichier bash (.sh) ou docker-compose) et des Dockerfile. 
Il est possible d'ajouter un readme.md (ou .txt) pour décrire votre démarche.

Tout doit être consigné via git.

### Les variables d'environment

Pour configurer plus facilement les serveurs il est possible d'utiliser les variables d'environment. (voir directement dans les readme des deux projets)

## Exercices

### Exercice 1: Dockeriser les Serveurs

Première étape lancer une exécution de 4 tâches avec un planner et un worker dans des container docker.

On commit!

### Exercice 2: Plusieurs workers

On veut pouvoir lancer plusieurs workers pour un seul planner pour parallèliser et accélérer l'exécution.
Pour ça il vous faudra modifier le code du planner (la ligne 12) :

```js
let workers = ['http://localhost:8080']
```

Pour qu'il dispatche les tâches à chaque workers.

Il existe aussi un script `connect.sh` qui peut être utilisé pour ajouter des workers en localhost.
```sh
./connect.sh 8080 8070
```
Il ajoutera des workers `'http://localhost:8080'` et `'http://localhost:8070'`.

On commit!

### Exercice 3: Spécialisation des workers

Par défaut les workers peuvent exécuter toutes tâches. On peut cependant imaginer que certains workers sont spécialisé dans une seule tâche.
Pour ça voir les variables d'environment du worker.

- lancez des workers spécialisés et observez le comportement du planner.
- corrigez les erreurs en modifiant le code du planner.

On commit!

### Exercice 4: Nombre de worker dynamique

On repasse avec des workers généraliste.
On veut maintenant pouvoir ajouter un nombre dynamique de worker pendant l'exécution du planner.

Les nouveaux workers fraichement lancés doivent s'enregistrer auprès du planner pour pouvoir recevoir des tâches.

Trouvez un moyen de lancer un planner et une dizaine de workers pour exécuter rapidement une cinquantaine de tâches en une seule commande.

On commit!

### Exercice 5: On mélange tout

En réutilisant le code fais ci-dessus :
Créez une configuration qui exécute une centaine de tâches dispatchées parmi :

- 10 workers généralistes
- 10 workers spécialisés en multiplications
- 10 workers spécialisés en additions

On commit!

Pensez à m'envoyer un lien vers votre git par mail: arthur.escriou@gmail.com

### Annexe

Some commands that could help you :

build an image (You have to run it in folder with a Dockerfile)

```sh
docker build -t imageName .
```

list of all docker images on your device

```sh
docker images
```

run an image

```sh
docker run -dit --name containerName --network networkName imageName  
```


stop docker container

```sh
docker stop containerName
```

run a terminal inside your container

```sh
docker exec -it containerName sh
```

get logs of a container

```sh
docker logs containerName 
```

list of all instances running on your device

```sh
docker ps
```

list of all networks on your device

```sh
docker network ls
```

put a container in a network

```sh
docker network connect networkName containerName
```

build and run a docker-compose stack (You have to run it in folder with a docker-compose.yml)

```sh
docker-compose up
```

#### Additionnaly you can use those official cheat sheets :

- <a href="https://dockerlabs.collabnix.com/docker/cheatsheet/"> Docker</a>

- <a href="https://devhints.io/docker-compose"> Docker-compose</a>
