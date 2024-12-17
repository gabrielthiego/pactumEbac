const { spec } = require('pactum');
const { eachLike, like } = require('pactum-matchers');

let token;

beforeEach(async() => {
  token = await spec()
    .post('http://lojaebac.ebaconline.art.br/graphql')
    .withGraphQLQuery(`
    mutation Mutation($email: String, $password: String) {
        authUser(email: $email, password: $password) {
          success
          token
        }
      }
`)
    .withGraphQLVariables({
       "email": "admin@admin.com",
       "password": "admin123"

    })

    .returns('data.authUser.token');


})

  it('USUARIOS', async () => {
    await spec()
      .post('http://lojaebac.ebaconline.art.br/graphql')
      .withHeaders("Authorization", token)  
      .withGraphQLQuery(`
        query {
          Users {
            id
            email
            profile {
              firstName
            }
          }
        }
      `)
      .expectStatus(200)
      .expectJsonMatch({
        data: {
          Users: eachLike({
            id: like("6717128dba6d5c2a89c2c4b9"),
            email: like("cliente@ebac.com.br"),
            profile: {
              firstName: like("cliente")
            }
          })
        }
      });
 });
