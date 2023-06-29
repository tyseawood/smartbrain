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
			box: {},
		}
	}

	calculateFaceLocation = (data) => {
		const clarifaiFace =
			data.outputs[0].data.regions[0].region_info.bounding_box
		const image = document.getElementById('input-image') as HTMLImageElement
		const width = Number(image.width)
		const height = Number(image.height)
		return {
			leftCol: clarifaiFace.left_col * width,
			topRow: clarifaiFace.top_row * height,
			rightCol: width - clarifaiFace.right_col * width,
			bottomRow: height - clarifaiFace.bottom_row * height,
		}
	}

	displayFaceBox = (box) => {
		this.setState({ box })
		console.log(box)
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
			.then((result) => this.displayFaceBox(this.calculateFaceLocation(result)))
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
					<FaceRecognition
						box={this.state.box}
						imageUrl={this.state.imageUrl}
					/>
				</div>
			</>
		)
	}
}

export default App
