import { Injectable } from '@angular/core';
import { SpecificationModel } from './specification.model';

@Injectable()
export class SpecificationService {


    specification = [{
        Id: 1,
        Name: 'Todas las Especificaciones',
        Sons: [
            {
                Id: 2,
                Name: 'Lente'
            }, {
                Id: 3,
                Name: 'Modelo'
            }, {
                Id: 4,
                Name: 'Resistencia'
            }, {
                Id: 5,
                Name: 'Voltaje'
            }, {
                Id: 6,
                Name: 'Tipo de Batería'
            }, {
                Id: 7,
                Name: 'Potencia'
            }
        ]
    }];

    specificationModel: SpecificationModel = new SpecificationModel(null, null, null);


}
