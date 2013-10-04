INPUT= $(shell find tsscripts -name "*.ts")
INPUT+=templates/dropletdestiny.html
OUTPUT=dropletdestiny_test.html templates/dropletdestiny.js

$(OUTPUT): $(INPUT)
	tsc -c --out templates/dropletdestiny.js tsscripts/dropletdestiny.ts
	makehtml --mode canvas-debug -t templates -t . -o dropletdestiny_test.html dropletdestiny.js dropletdestiny.html

.PHONY: clean

clean: $(OUTPUT)
	rm -rf $^
