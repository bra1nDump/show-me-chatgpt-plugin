# This project is now private and the public version is not actively updated
Thanks for all the stars and usage of the product! I wanted to provide clarity on why the commits have stopped:
Our team is working on integrating with some partners and we dont currently feel comfortable publicaly sharing that code. 
There are now multiple competitors in the diagram ChatGPT plugin space and we want to avoid loosing our competetive edge by sharing the latest updates to the code.

If you strongly feel we should open the source again message kirill2003de@gmail.com with your reasons. 

# Diagrams in ChatGPT - Show Me
Create and edit diagrams in seconds without even leaving the chat.

## Understand processes in a glance. Example: iOS Application lifecycle
<img width="643" alt="image" src="https://user-images.githubusercontent.com/12608159/235550530-e5021790-76a9-4e9a-b352-60c723cdb32b.png">

## Create diagrams from a description. Example: A distributed system diagram
<img width="643" alt="image" src="https://user-images.githubusercontent.com/12608159/235550652-53e0784d-ea61-461e-a8b4-2ff060948220.png">

## Make edits
<img width="643" alt="image" src="https://user-images.githubusercontent.com/12608159/235551055-6cba6236-8bce-4c0e-bf74-ea58f7a11019.png">

## Support
- Create issues in this repo for missing features and consider contributing
- Grab one of the existing issues or create an issue you want to work on

# How to run the project
## local
- Run `npm install`
- To run the server, run `npm run dev`
- Navigate to https://chat.openai.com.
- In the Model drop down, select "Plugins" (note, if you don't see it there, you don't have access yet).
- Select "Plugin store"
- Select "Develop your own plugin"
- Enter in localhost:8787 since this is the URL the server is running on locally, then select "Find manifest file".
- The plugin should now be installed and enabled! You can start with a question like "Show me how VSCode architecture looks like"
## Docker
- run `docker-compose up -d`

> Note: There is some unused code in the repo which we didn't have time to clean up. Its mostly related to running GPT-4 on the server side and multi diagram support.

## License
AGPL-3.0
