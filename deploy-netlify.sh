#!/bin/bash

# Script to deploy the project to Netlify via CLI using npx to avoid global install issues

echo "Building the project..."
npm run build

# Check if the site is already linked
if ! npx netlify status &> /dev/null
then
    echo "Netlify site not linked. Running netlify init..."
    npx netlify init
fi

echo "Deploying to Netlify..."
npx netlify deploy --prod --dir=dist

echo "Opening deployed site in browser..."
npx netlify open

echo "Deployment complete."
