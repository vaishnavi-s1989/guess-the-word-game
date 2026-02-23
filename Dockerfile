FROM nginx:alpine
COPY . /usr/share/nginx/html
EXPOSE 80
```

Your project folder should look like this:
```
├── Dockerfile
├── index.html
├── styles.css
├── script.js
└── README.md