/// <reference types="cypress" />

describe('Products api', () => {
    context('GET /catalog/api/v1/products/search?name=hp pro', () => {
        it('Deve retornar produto HP Pro Tablet 608', () => {
            cy.request({
                method: 'GET',
                url: 'https://www.advantageonlineshopping.com/catalog/api/v1/products/search?name=hp pro'
            })
                .then((response) => {
                    cy.log(JSON.stringify(response.body));
                    expect(response.status).to.be.equal(200);
                    expect(response.body[0].products[0]).is.not.empty;
                    expect(response.body[0].products[0]).to.have.all.keys(
                        'productId', 'categoryId', 'productName', 'price', 'imageUrl'
                    );
                    expect(response.body[0].products[0].productId).to.eq(18);
                    expect(response.body[0].products[0].categoryId).to.eq(3);
                    expect(response.body[0].products[0].productName).to.eq("HP Pro Tablet 608 G1");
                    expect(response.body[0].products[0].price).to.eq(479);
                    expect(response.body[0].products[0].imageUrl).to.eq('3300');
                })
        });
    });
    context('POST /catalog/api/v1/product/image/{userId}/{source}/{color}', () => {
        it('Deve fazer upload de imagem via API', () => {
            
            const data = new FormData();
            const fileToUpload = "arara.jpeg";
            const aliasName = "imageUploadRequest";
            const APIurl = 'https://www.advantageonlineshopping.com/api/v1/product/image/137003825/1249?product_id=9'
            const authorization = "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJ3d3cuYWR2YW50YWdlb25saW5lc2hvcHBpbmcuY29tIiwidXNlcklkIjoxMzcwMDM4MjUsInN1YiI6ImFsaWNlc2FudG9zIiwicm9sZSI6IkFETUlOIn0.vvIAz5LeoauE_jUm46gjem9BAgmQreMsVXgasW3t-ac"
            data.append("hasHeader", "true");

            cy.intercept({
                method: 'POST',
                url: APIurl
            })
                .as(aliasName)
                .window()
                .then((win) => {
                    cy.fixture(fileToUpload, "binary")
                    .then((binary) => Cypress.Blob.binaryStringToBlob(binary))
                    .then((blob) => {
                        const xhr = new win.XMLHttpRequest();
                        data.set("fetchImage", blob, fileToUpload);
                        xhr.open("POST", APIurl);
                        xhr.setRequestHeader("Authorization", authorization);
                        xhr.send(data);
                    });
                });
                
                cy.wait('@imageUploadRequest').then(({response}) => {
                    expect(response.statusCode).to.eq(200);
                    expect(response.body).to.contain.property("imageId")
                })
        });
    });
});