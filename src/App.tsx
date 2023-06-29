import { Component } from 'react'
import Navigation from './components/Navigation/Navigation.tsx'
import Logo from './components/Logo/Logo.tsx'
import Rank from './components/Rank/Rank.tsx'
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm.tsx'
import FaceRecognition from './components/FaceRecognition/FaceRecognition.tsx'
import './App.css'
import 'tachyons'

const returnClarifaiRequestOptions = (imageUrl) => {
	const PAT = '0c09f15969a642a6a9526f22b1af1570'
	const USER_ID = 'tyseawood'
	const APP_ID = 'smartbrain'

	const raw = JSON.stringify({
		user_app_id: {
			user_id: USER_ID,
			app_id: APP_ID,
		},
		inputs: [
			{
				data: {
					image: {
						url: imageUrl,
					},
				},
			},
		],
	})

	return {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			Authorization: 'Key ' + PAT,
		},
		body: raw,
	}
}

class App extends Component<any, any> {
	constructor(props) {
		super(props)
		this.state = {
			input: '',
			imageUrl: '',
		}
	}

	onInputChange = (event) => {
		this.setState({ input: event.target.value })
	}

	onButtonSubmit = () => {
		this.setState({ imageUrl: this.state.input })

		fetch(
			'https://api.clarifai.com/v2/models/' + 'face-detection' + '/outputs',
			returnClarifaiRequestOptions(this.state.input)
		)
			.then((response) => response.json())
			.then((result) => console.log(result))
			.catch((error) => console.log('error', error))
	}

	render() {
		return (
			<>
				<div className={'App'}>
					<Navigation />
					<Logo />
					<Rank />
					<ImageLinkForm
						onInputChange={this.onInputChange}
						onButtonSubmit={this.onButtonSubmit}
					/>
					<FaceRecognition imageUrl={this.state.imageUrl} />
				</div>
			</>
		)
	}
}

export default App
