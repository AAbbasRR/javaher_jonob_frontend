# Use node js alpine images
FROM node:20-alpine as builder

# Set environment variables for node js
# ENV NODE_ENV production

# Set the working directory in the container
WORKDIR /app

# Copy the package.json, yarn.lock, files into the container
COPY . .

# Install all dependencies packages
RUN yarn install --production

# Building app
RUN yarn run build

# Use nginx latest version images
FROM nginx:latest as production

# Copy built assets from builder
COPY --from=builder /app/build /usr/share/nginx/html

# Add nginx.conf to nginx configuration directory
COPY nginx.conf /etc/nginx/conf.d/front.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]