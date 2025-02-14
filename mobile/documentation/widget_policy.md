# Politique des widgets

## L'arborescence

L'arborescence est comme suit :
    - Navigateur (Widget MyAPP)
        - Page
            - Composant
                - Element
1. Les différents niveaux peuvent transmettrent leur etat à travers un provider
### Le Navigateur
1. Le Navigateur ne gere que les routes et les données globales à l'application

### Les Page (/lib/pages)
1. Les Pages sont crées dans le dossier lib/pages
1. Le chemin relatif d'une Page à partir du dossier lib/pages doit correspondre à son chemin d'acces dans le Navigateur
1. Les Page doivent occuper tout l'écran en la récupérant par un MediaQuery.sizeOf(context)
1. Les pages ne reçoivent aucun paramètre autre que la Key, ils recuperent leurs etats à travers un provider
### Les Composant (/lib/components)
1. Un Composant n'est pertinent que si il est utilisé par au moins 2 Pages
1. Les Composant  doivent récupérer leur tailles maximum en paramètre size de type Size
### Les Element (/lib/components/(component_name)/)
1. Un Element ne doit être utilisé que dans d'autres Element du même Composant ou directement dans le même Composant
1. En cas de besoin de reutilisation d'un Element dans un autre Composant, veuillez le copier svp