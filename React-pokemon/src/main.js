import React from 'react'
import faker from 'faker'
import ReactDom from 'react-dom'
import superagent from 'superagent'

const API_URL = 'https://pokeapi.co/api/v2'

class PokemonForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
          pokeName: ''
        }

        this.handleSubmit = this.handleSubmit.bind(this)
        this.handlePokeNameChange = this.handlePokeNameChange.bind(this)
    }

    handlePokeNameChange(e){
        this.setState({pokeName: e.target.value})
    }

    handleSubmit(e){
        e.preventDefault()
        this.props.pokemonSelect(this.state.pokeName)
    }

    render(){
        return (
            //ALL INPUTS SHOULD HAVE THEIR VALUES BOUND TO A STATE, THIS IS CALLED CONTROLLED INPUTS
            <form onSubmit={this.handleSubmit} >
                <input
                  type='text'
                  name='pokemonName'
                  placeholder='poke name'
                  value={this.state.pokeName}
                  onChange={this.handlePokeNameChange}
                />
                <p> name: </p>
                <p> {this.state.pokeName} </p>
            </form>
        )
    }
}

class App extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            pokemonLookup: [],
            pokemonSelected: null,
            pokemonNameError: 'name error',
        }

        this.pokemonSelect = this.pokemonSelect.bind(this)
    }
    //called everytime the state is changed
    componentDidUpdate() {
        console.log('___STATE___', this.state)
    }
    //this will get called once right before the app component gets
    //added to the dom, mount means to add it to the DOM.
    componentDidMount(){
        console.log('hell, low whirled')
        if(localStorage.pokemonLookup) {
            try{
             let pokemonLookup = JSON.parse(localStorage.pokemonLookup)
             this.setState({pokemonLookup})
            } catch(err) {
             console.log(err)
          }
        } else {
            superagent.get(`${API_URL}/pokemon/`)
            .then(res => {
                let pokemonLookup = res.body.results.reduce((lookup, next) => {
                    lookup[next.name] = next.url;
                    return lookup
                }, {})

                console.log("pokemonLookup", pokemonLookup)

                try {
                    localStorage.pokemonLookup = JSON.stringify(pokemonLookup)
                    this.setState({pokemonLookup})
                } catch (err) {
                    console.error(err)
                }
            })
            .catch(console.error)
        }
    }


    pokemonSelect(name){
        if(!this.state.pokemonLookup[name]) {
            //do something on state that enable the view to show an error
            //that pokemmon does not exist
            this.setState({
                pokemonSelected: null,
                pokemonNameError: name,
            })
        } else {
            //make a request to the pokemon api and do something
            //on state to store the pokemons details to be displayed to the user
            superagent.get(this.state.pokemonLookup[name])
            .then(res => {
                console.log('selected pokemon:  ',res.body)
                this.setState({
                    pokemonSelected: res.body,
                    pokemonNameError: null,
                })
            })
            .catch(console.error)
        }


    }
    render(){
        return (
            <div>
              <h1> form demo </h1>  
              <PokemonForm pokemonSelect={this.pokemonSelect} />
              { this.state.pokemonNameError ? 
              <div> 
                <h2> pokemon {this.state.pokemonNameError} does not exist </h2>
                <p> make another request! </p>
              </div> : 
              <div> 
                <h2> selected: {this.state.pokemonSelected.name} </h2>
                <p> Yeah it worked!! </p>
              </div> }
              
            </div>
        )
    }
}

const container = document.createElement('div')
document.body.appendChild(container)
ReactDom.render(<App />, container)