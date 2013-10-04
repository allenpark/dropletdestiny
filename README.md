dropletdestiny
==============

Droplet Destiny (6.073 fall 2013 project 3)

#How to use Turbulenz

- For an example of a working, simple Turbulenz project: https://github.com/sherbondy/lettercannon

- Install the Turbulenz SDK: https://hub.turbulenz.com/#downloads (requires login).
- Make sure you are using typescript version 0.8! `tsc --version`:
```
 sudo npm install -g typescript@0.8.3
```
- Modify the files in `tsscripts/`, then run (from the root directory):

```
tsc -c --out templates/dropletdestiny.js tsscripts/dropletdestiny.ts

makehtml --mode canvas-debug -t templates -t . -o dropletdestiny_test.html dropletdestiny.js dropletdestiny.html
```

To test the game:
- Run a static python server: `python -m SimpleHTTPServer`
- Visit http://localhost:8000/[HTML_OUTPUT].html

