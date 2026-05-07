# Pokemon TFG - Comandos de desarrollo
# Uso: make <comando>
# Ejemplo: make front-start

.PHONY: help front-start back-start xampp stop

## help: Muestra esta ayuda con todos los comandos disponibles
help:

	@echo "  Los comandos que se pueden utilizar son los siguientes:"
	@echo ""
	@echo "  make front-start  - Inicia el servidor de desarrollo frontend"
	@echo "  make back-start   - Inicia el backend Spring Boot"
	@echo "  make xampp        - Abre el panel de control de XAMPP"
	@echo "  make stop         - Detiene todos los servicios"

## front-start: Inicia el servidor de desarrollo del frontend (Vite/React)
front-start:
	@echo "Iniciando frontend..."
	cd PokeDatto && npm run dev

## back-start: Inicia el backend con Spring Boot Maven
back-start:
	@echo "Iniciando backend..."
	cd back && mvn spring-boot:run

## xampp: Abre el panel de control de XAMPP con sudo
xampp:
	@echo "Abriendo XAMPP Control Panel..."
	sudo /opt/lampp/manager-linux-x64.run

## stop: Detiene todos los servicios (frontend, backend y XAMPP)
stop:
	@echo "🛑 Deteniendo todos los servicios..."
	@echo "  • Frontend (puerto 5173)..."
	@lsof -ti:5173 | xargs kill -9 2>/dev/null || true
	@echo "  • Backend (puerto 9876)..."
	@lsof -ti:9876 | xargs kill -9 2>/dev/null || true
	@echo "  • XAMPP..."
	@sudo /opt/lampp/xampp stop 2>/dev/null || true
	@echo "✅ Todos los servicios detenidos"
