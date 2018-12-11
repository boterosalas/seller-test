import { async } from '@angular/core/testing';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { endpoints } from '@root/api-endpoints';


fdescribe('endpoints', () => {


    beforeEach(() => {
    });

    it('Deberia obtener los api endpoints de desarrollo', () => {
        expect(endpoints.stage).toBeDefined();
    });

    it('Deberia tener el mismo numero de endpoints en produccion y en desarrollo', () => {
        let exist = false;
        const arrayApi = [];

        Object.keys(endpoints.stage.v1).forEach(elementQa => {
            exist = false;
            Object.keys(endpoints.prod.v1).forEach(elementProd => {
                if (elementProd === elementQa) {
                    exist = true;
                }
            });
            if (!exist) {
                arrayApi.push(elementQa);
            }
        });


        Object.keys(endpoints.prod.v1).forEach(elementProd => {
            exist = false;
            Object.keys(endpoints.stage.v1).forEach(elementQa => {
                if (elementProd === elementQa) {
                    exist = true;
                }
            });
            if (!exist) {
                arrayApi.push(elementProd);
            }
        });
        console.error('EndPoints faltantes', arrayApi); // No borrar, logger informativo de endpoints faltantes
        expect(Object.keys(endpoints.stage.v1).length).toBe(Object.keys(endpoints.prod.v1).length);
    });

    it('Deberia ser similar la estructura de los end-points', () => {
        if (Object.keys(endpoints.stage.v1).length === Object.keys(endpoints.prod.v1).length) {
            let count = 0;
            Object.keys(endpoints.stage.v1).forEach(elementQa => {
                if (endpoints.stage.v1[elementQa].split('/').length !== endpoints.prod.v1[Object.keys(endpoints.prod.v1)[count]].split('/').length) {
                    console.warn('Este end point presenta una estructura diferente de QA a produccion para tener en cuenta: ' + elementQa);
                }
                count++;
            });
        }
    });

});
