# COMS 4170 UI Design Final Project

- [Github Project](https://github.com/users/Zehua-Chen/projects/2/views/1)

## People

- [Zehua Chen, zc2616@columbia.edu](https://github.com/Zehua-Chen)
- [Yuxuan Jia, yj2680@columbia.edu](https://github.com/nuomicii)
- [Shangru Li, sl4986@columbia.edu](https://github.com/sl4986)
- [Chenchen Deng, cd3301@columbia.edu](https://github.com/GraceD5)

## Repo Content

- [src](src/): frontend; JavaScript/TypeScript source code, (optional) style
  sheets, media
  - [pages](src/pages/): JavaScript/TypeScript code for each page
  - [components](src/components/): components (see
    [`Component.ts`](src/components/Component.ts) for how to implement new
    components)
- [app](app/): server

### Where is `static`?

Unlike a typical Flask application, we don't have a `static` folder to serve
js/ts, css and media files. We use [Vite](https://vitejs.dev/) to manage these
files

- **In production**: Vite would create a static folder from `src/`
- **In development**: A vite server is started first using `src/index.ts` as
  entry point, and `templates/layout.html` has been configured to find the
  js/ts, css and media files from `localhost:3000`, where the Vite server is
  running at. **As a result, please put all js/ts, css and media files in `src`,
  and then reference them in js/ts script in order for the Vite server to pick
  them up**

## Get Started

1. **Install Python dependencies**: `pip install -e .`
2. **Install Node dependencies**: `yarn install`
   - Install yarn if you have not: `npm install -g yarn`
   - Install node, npm if you have not (preferrably using `nvm`)
3. **Start the web app**: `yarn start`
   - Flask server running at: `localhost:4000`
   - Vite server running at: `localhost:3000`

## Development

### Python Tools

```
$ pip install autopep8
$ pip install pylint
```

### Building

```
$ yarn build
```
