# NAGIT - NEM API Graphical Interactive Tool

NAGIT - NEM API Graphical Interactive Tool is a graphical tool running on Node.js that 
enables faster and simpler development of NEM Projects.

## Features

- Easy interface
- Connect to a custom NIS node or a default one
- Pretty print server responses
- English and Spanish translations
- Review your past requests JSON data
- Generate a wallet for testing
- Generate QR Codes
- More than 20 different requests available

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

[Node.js](https://nodejs.org/es/download/) to run the app

### Installing

Clone this repository 

```
git clone https://github.com/ccastromar/nagit.git
```

Execute npm install 

```
npm install
```

## Running the tool

Execute the app

```
node app.js 
```

## Deployment

When Node.js is running then open a browser at http://localhost:8000


# Documentation


## Changing the NIS Node

Click 'Node' to toggle the node panel.
You can connect to a default https node for testnet and mainnet.
Enter your host and port and click 'Save' to connect to a custom node.

## Working with history

Click 'History' to toggle the history panel.
You can view past requests. Click on any function to view the details or click the trash icon to delete any request.

## Sending requests

Select a function from the list.
A description will be shown, and all mandatory input fields will be actived (in green). 
If the request doesn't need any input data, all input fields will be disabled.
Enter the information needed and click 'Send'.
When the server has responded the output will be shown at the bottom.

## Clearing input and output data

To clear input data and output data simply click 'Clear' in the desired section.


## Built With 

* [VisualCode](https://code.visualstudio.com/) - The editor

## Contributing

Please read [CONTRIBUTING.md](https://gist.github.com/ccastromar/b24679402957c63ec426) for details on our code of conduct, and the process for submitting pull requests to me.

## Versioning

For the versions available, see the [tags on this repository](https://github.com/ccastromar/nagit/tags). 

## Authors

* **Carlos Castro Martos** - *Initial work* - [ccastromar](https://github.com/ccastromar)

See also the list of [contributors](https://github.com/ccastromar/project/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* [QuantumMechanics](https://github.com/QuantumMechanics)
* [NEM Foundation](https://nem.io)

