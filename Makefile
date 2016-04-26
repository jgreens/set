all:
	./run.sh
restart:
	kill `ps auxx | grep node | head -1 | cut -d' ' -f6`
	./run.sh
