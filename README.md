# Curaytor 'M'
Application dedicated to manage 
[instant-web-messaging](https://github.com/Curaytor/instant-web-messaging)

This application is built with [React](https://facebook.github.io/react/) 
following [Flux](https://facebook.github.io/flux/docs/overview.html) 
pattern with [Redux](http://redux.js.org/docs/introduction/) implementation.

## Setup

After forking/cloning the repo, setup the VM with the Vagrantfile 
in order to setup the node version as much as other dependencies. Then, 
ask for the **.env** file.

In the root of the project, run:
```bash
$ npm install
```

Launch app:
```bash
$ npm run start
```

To start the server (with redux logger enabled), run:
```bash
$ npm run debug
```

Run test cases

```bash
$ npm test
```

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b feature/name-of-the-feature`
3. **Create test cases for your code**
4. **Make regression testing**
4. Commit your changes: `git commit -am 'name-of-the-feature # short description of what you did'`
5. Push to the branch: `git push origin feature/name-of-the-feature`
6. Submit a pull request to the appropriate branch :D

## Authors

* **[Luis Canales](https://github.com/kopz9999)** - *Initial work*

## Versioning

For the versions available, see the [tags on this repository](https://github.com/Curaytor/admin-web-messaging/tags). 

## TODO:
- **Put /server code in a separate repository**
  - This change will also remove 
- Code coverage reports
- Browser automation testing
