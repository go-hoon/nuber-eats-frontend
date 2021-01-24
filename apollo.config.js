module.exports = {
    client: { 
        includes:["./src/**/*.{tsx,ts}"],
        tageName: "gql",
        service: {
            name: "uber-eats-backned",
            url: "http://localhost:4000/graphql",
        }
    },
  };