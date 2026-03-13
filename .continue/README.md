# Continue.dev - Configuration AGI-OS-DAO

## Setup rapide (gratuit & open-source)

### Option 1 : OpenRouter (Recommandé - Gratuit)
1. Créez un compte sur https://openrouter.ai
2. Obtenez votre API key gratuite
3. Remplacez `YOUR_OPENROUTER_API_KEY` dans `config.json`
4. Modèles gratuits inclus : DeepSeek V3, Llama 3.3 70B

### Option 2 : Ollama Local (100% Privé)
1. Installez Ollama : https://ollama.ai
2. Lancez : `ollama pull codellama:7b`
3. Continue détecte Ollama automatiquement

## Installation Continue dans VS Code
1. Cherchez **Continue** dans les extensions VS Code
2. Installez l'extension officielle
3. Ce fichier config est auto-détecté ✅

## Commandes custom pour ce projet
- `/agi-review` - Review code AGI/multi-agent
- `/dao-agent` - Helper DAO governance
- `/test` - Générer tests unitaires
- `/edit` - Editer le code sélectionné

## Stack supportée
- **Frontend** : Next.js / TypeScript / Tailwind
- **Backend** : Python / Litestar
- **Docker** : Dockerfile + docker-compose
