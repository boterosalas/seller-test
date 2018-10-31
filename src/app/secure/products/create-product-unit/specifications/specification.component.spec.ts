import { async } from '@angular/core/testing';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { MaterialModule } from '@app/material.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogRef } from '@angular/material';

import { SpecificationProductComponent } from './specification.component';
import { SpecificationService } from './specification.component.service';
import { SpecificationModel } from './specification.model';
import { SpecificationDialogComponent } from './dialog/dialog.component';

describe('SpecificationProductComponent', () => {

    /** Elements to launch and manipulate component */
    let fixture: ComponentFixture<SpecificationProductComponent>;
    let component: SpecificationProductComponent;

    const specificationModel = new SpecificationModel(null, null, null);

    const specificationService = <SpecificationService>{
        getSpecifications(): Observable<any> {
            return of( structureJson );
        }
    };

    const specification = [{
        Id: 1,
        Name: 'Todas las Especificaciones',
        Show: false,
        Value: null,
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
            }, {
                Name: 'Especificaciones',
                Id: 0
            },
            {
                Name: 'Compatibilidad',
                Id: 1
            },
            {
                Name: 'Garantía proveedor',
                Id: 2
            },
            {
                Name: 'Entrada ',
                Id: 3
            },
            {
                Name: 'Conexión USB',
                Id: 4
            },
            {
                Name: 'Conexión',
                Id: 5
            },
            {
                Name: 'Unidad Óptica',
                Id: 6
            },
            {
                Name: 'Sensor de imagen',
                Id: 7
            },
            {
                Name: 'Sensibilidad ISO',
                Id: 8
            },
            {
                Name: 'Tipo de obturador',
                Id: 9
            },
            {
                Name: 'Velocidad del obturador',
                Id: 10
            },
            {
                Name: 'Diafragma',
                Id: 11
            },
            {
                Name: 'Flash',
                Id: 12
            },
            {
                Name: 'Temporizador',
                Id: 13
            },
            {
                Name: 'Distancia focal',
                Id: 14
            },
            {
                Name: 'Material Principal',
                Id: 15
            },
            {
                Name: 'Sistema operativo',
                Id: 16
            },
            {
                Name: 'Rango de la cámara principal',
                Id: 17
            },
            {
                Name: 'Rango del tamaño de la pantalla',
                Id: 18
            },
            {
                Name: 'Capacidad',
                Id: 19
            },
            {
                Name: 'RAM',
                Id: 20
            },
            {
                Name: 'Memoria Interna',
                Id: 21
            },
            {
                Name: 'Modelo',
                Id: 22
            },
            {
                Name: 'Resistencia',
                Id: 23
            },
            {
                Name: 'Voltaje',
                Id: 24
            },
            {
                Name: 'Tipo de Batería',
                Id: 25
            },
            {
                Name: 'Potencia',
                Id: 26
            },
            {
                Name: 'Especificaciones',
                Id: 27
            },
            {
                Name: 'Compatibilidad',
                Id: 28
            },
            {
                Name: 'Sistema de Audio',
                Id: 29
            },
            {
                Name: 'Garantía proveedor',
                Id: 30
            },
            {
                Name: 'Entrada ',
                Id: 31
            },
            {
                Name: 'Conexión USB',
                Id: 32
            },
            {
                Name: 'Dual Sim',
                Id: 33
            },
            {
                Name: 'Conexión',
                Id: 34
            },
            {
                Name: 'Cámara principal',
                Id: 35
            },
            {
                Name: 'Tamaño de pantalla',
                Id: 36
            },
            {
                Name: 'Cámara frontal',
                Id: 37
            },
            {
                Name: 'Tipo de Sim',
                Id: 38
            },
            {
                Name: 'Conectividad',
                Id: 39
            },
            {
                Name: 'Material Principal',
                Id: 40
            },
            {
                Name: 'Tamaño',
                Id: 41
            },
            {
                Name: 'Tipo',
                Id: 42
            },
            {
                Name: 'Confort',
                Id: 43
            },
            {
                Name: 'Peso promedio por persona',
                Id: 44
            },
            {
                Name: 'Gama',
                Id: 45
            },
            {
                Name: 'Material Principal',
                Id: 46
            },
            {
                Name: 'Modelo',
                Id: 47
            },
            {
                Name: 'Carga útil',
                Id: 48
            },
            {
                Name: 'Resistencia',
                Id: 49
            },
            {
                Name: 'Licencia',
                Id: 50
            },
            {
                Name: 'Especificaciones',
                Id: 51
            },
            {
                Name: 'Compatibilidad',
                Id: 52
            },
            {
                Name: 'Fabricante',
                Id: 53
            },
            {
                Name: 'Edades',
                Id: 54
            },
            {
                Name: 'Garantía proveedor',
                Id: 55
            },
            {
                Name: 'Información adicional',
                Id: 56
            },
            {
                Name: 'Brillo',
                Id: 57
            },
            {
                Name: 'Material Principal',
                Id: 58
            },
            {
                Name: 'Especificaciones',
                Id: 59
            },
            {
                Name: 'Compatibilidad',
                Id: 60
            },
            {
                Name: 'Fabricante',
                Id: 61
            },
            {
                Name: 'Edad',
                Id: 62
            },
            {
                Name: 'Modelo',
                Id: 63
            },
            {
                Name: 'Resistencia',
                Id: 64
            },
            {
                Name: 'Voltaje',
                Id: 65
            },
            {
                Name: 'Potencia',
                Id: 66
            },
            {
                Name: 'Especificaciones',
                Id: 67
            },
            {
                Name: 'Compatibilidad',
                Id: 68
            },
            {
                Name: 'Tipo de Instrumento',
                Id: 69
            },
            {
                Name: 'Información adicional',
                Id: 70
            },
            {
                Name: 'Conexión USB',
                Id: 71
            },
            {
                Name: 'Capacidad',
                Id: 72
            },
            {
                Name: 'Tipo',
                Id: 73
            },
            {
                Name: 'Estilo',
                Id: 74
            },
            {
                Name: 'Referencia',
                Id: 75
            },
            {
                Name: 'Beneficio',
                Id: 76
            },
            {
                Name: 'Tipo de panel',
                Id: 77
            },
            {
                Name: 'Peso Neto',
                Id: 78
            },
            {
                Name: 'Peso Bruto',
                Id: 79
            },
            {
                Name: 'Voltaje',
                Id: 80
            },
            {
                Name: 'Material principal ',
                Id: 81
            },
            {
                Name: 'Genero',
                Id: 82
            },
            {
                Name: 'Color Marco',
                Id: 83
            },
            {
                Name: 'Color Lente',
                Id: 84
            },
            {
                Name: 'Ancho de Lente',
                Id: 85
            },
            {
                Name: 'Largo de Puente',
                Id: 86
            },
            {
                Name: 'Largo de Varilla',
                Id: 87
            },
            {
                Name: 'Peso Bruto',
                Id: 88
            },
            {
                Name: 'Peso Neto',
                Id: 89
            },
            {
                Name: 'Color Principal',
                Id: 90
            },
            {
                Name: 'Formato',
                Id: 91
            },
            {
                Name: 'Material Principal',
                Id: 92
            },
            {
                Name: 'Estilo',
                Id: 93
            },
            {
                Name: 'Beneficios',
                Id: 94
            },
            {
                Name: 'Material Principal',
                Id: 95
            },
            {
                Name: 'Modelo',
                Id: 96
            },
            {
                Name: 'Carga útil',
                Id: 97
            },
            {
                Name: 'Resistencia',
                Id: 98
            },
            {
                Name: 'Licencia',
                Id: 99
            },
            {
                Name: 'Especificaciones',
                Id: 100
            },
            {
                Name: 'Compatibilidad',
                Id: 101
            },
            {
                Name: 'Fabricante',
                Id: 102
            },
            {
                Name: 'Edades',
                Id: 103
            },
            {
                Name: 'Garantía proveedor',
                Id: 104
            },
            {
                Name: 'Información adicional',
                Id: 105
            },
            {
                Name: 'Brillo',
                Id: 106
            },
            {
                Name: 'Tamaño de pantalla',
                Id: 107
            },
            {
                Name: 'Resolución de pantalla',
                Id: 108
            },
            {
                Name: 'Familia de procesador',
                Id: 109
            },
            {
                Name: 'Sistema operativo',
                Id: 110
            },
            {
                Name: 'Capacidad de disco duro',
                Id: 111
            },
            {
                Name: 'Memoria del sistema (RAM)',
                Id: 112
            },
            {
                Name: 'Modelo',
                Id: 113
            },
            {
                Name: 'Resistencia',
                Id: 114
            },
            {
                Name: 'Voltaje',
                Id: 115
            },
            {
                Name: 'Tipo de Batería',
                Id: 116
            },
            {
                Name: 'Potencia',
                Id: 117
            },
            {
                Name: 'Especificaciones',
                Id: 118
            },
            {
                Name: 'Compatibilidad',
                Id: 119
            },
            {
                Name: 'Tipo de procesador',
                Id: 120
            },
            {
                Name: 'Sistema de Audio',
                Id: 121
            },
            {
                Name: 'Garantía proveedor',
                Id: 122
            },
            {
                Name: 'Entrada ',
                Id: 123
            },
            {
                Name: 'Conexión USB',
                Id: 124
            },
            {
                Name: 'Tamaño de pantalla',
                Id: 125
            },
            {
                Name: 'Cámara frontal',
                Id: 126
            },
            {
                Name: 'Conectividad',
                Id: 127
            },
            {
                Name: 'Tarjeta de vídeo',
                Id: 128
            },
            {
                Name: 'Cámara web',
                Id: 129
            },
            {
                Name: 'Unidad Óptica',
                Id: 130
            },
            {
                Name: 'Material Principal',
                Id: 131
            },
            {
                Name: 'Capacidad en libras',
                Id: 132
            },
            {
                Name: 'Capacidad en Kilogramos',
                Id: 133
            },
            {
                Name: 'Tipo de carga',
                Id: 134
            },
            {
                Name: 'Modelo',
                Id: 135
            },
            {
                Name: 'Resistencia',
                Id: 136
            },
            {
                Name: 'Voltaje',
                Id: 137
            },
            {
                Name: 'Potencia',
                Id: 138
            },
            {
                Name: 'Especificaciones',
                Id: 139
            },
            {
                Name: 'Compatibilidad',
                Id: 140
            },
            {
                Name: 'Tipo de Instrumento',
                Id: 141
            },
            {
                Name: 'Información adicional',
                Id: 142
            },
            {
                Name: 'Capacidad',
                Id: 143
            },
            {
                Name: 'Tipo',
                Id: 144
            },
            {
                Name: 'Estilo',
                Id: 145
            },
            {
                Name: 'Referencia',
                Id: 146
            },
            {
                Name: 'Beneficio',
                Id: 147
            },
            {
                Name: 'Tipo de panel',
                Id: 148
            },
            {
                Name: 'Peso Neto',
                Id: 149
            },
            {
                Name: 'Peso Bruto',
                Id: 150
            },
            {
                Name: 'Material principal ',
                Id: 151
            },
            {
                Name: 'Diámetro de Neumático',
                Id: 152
            },
            {
                Name: 'Largo de Neumático',
                Id: 153
            },
            {
                Name: 'Altura del Neumático',
                Id: 154
            },
            {
                Name: 'Ancho (Llanta)',
                Id: 155
            },
            {
                Name: 'Perfil (Llanta)',
                Id: 156
            },
            {
                Name: 'Radial (Llanta)',
                Id: 157
            },
            {
                Name: 'Cilindraje (Litros)',
                Id: 158
            },
            {
                Name: 'Resistencia',
                Id: 159
            },
            {
                Name: 'Genero',
                Id: 160
            },
            {
                Name: 'Peso Bruto',
                Id: 161
            },
            {
                Name: 'Peso Neto',
                Id: 162
            },
            {
                Name: 'Color Principal',
                Id: 163
            },
            {
                Name: 'Formato',
                Id: 164
            },
            {
                Name: 'Material Principal',
                Id: 165
            },
            {
                Name: 'Estilo',
                Id: 166
            },
            {
                Name: 'Beneficios',
                Id: 167
            },
            {
                Name: 'Referencia',
                Id: 168
            },
            {
                Name: 'Resistencia al Agua',
                Id: 169
            },
            {
                Name: 'Material De Pulso',
                Id: 170
            },
            {
                Name: 'Material de la Caja',
                Id: 171
            },
            {
                Name: 'Tipo de Hora',
                Id: 172
            },
            {
                Name: 'INVIMA',
                Id: 173
            },
            {
                Name: 'Rango de litros',
                Id: 174
            },
            {
                Name: 'Dispensador de agua',
                Id: 175
            },
            {
                Name: 'Dispensador de hielo',
                Id: 176
            },
            {
                Name: 'Modelo',
                Id: 177
            },
            {
                Name: 'Resistencia',
                Id: 178
            },
            {
                Name: 'Voltaje',
                Id: 179
            },
            {
                Name: 'Potencia',
                Id: 180
            },
            {
                Name: 'Especificaciones',
                Id: 181
            },
            {
                Name: 'Compatibilidad',
                Id: 182
            },
            {
                Name: 'Tipo de Instrumento',
                Id: 183
            },
            {
                Name: 'Información adicional',
                Id: 184
            },
            {
                Name: 'Conexión USB',
                Id: 185
            },
            {
                Name: 'Capacidad',
                Id: 186
            },
            {
                Name: 'Tipo',
                Id: 187
            },
            {
                Name: 'Estilo',
                Id: 188
            },
            {
                Name: 'Referencia',
                Id: 189
            },
            {
                Name: 'Beneficio',
                Id: 190
            },
            {
                Name: 'Tipo de panel',
                Id: 191
            },
            {
                Name: 'Peso Neto',
                Id: 192
            },
            {
                Name: 'Peso Bruto',
                Id: 193
            },
            {
                Name: 'Voltaje',
                Id: 194
            },
            {
                Name: 'Material principal ',
                Id: 195
            },
            {
                Name: 'Tamaño',
                Id: 196
            },
            {
                Name: 'Concentracion',
                Id: 197
            },
            {
                Name: 'Genero',
                Id: 198
            },
            {
                Name: 'Peso Bruto',
                Id: 199
            },
            {
                Name: 'Peso Neto',
                Id: 200
            },
            {
                Name: 'Color Principal',
                Id: 201
            },
            {
                Name: 'Formato',
                Id: 202
            },
            {
                Name: 'Material Principal',
                Id: 203
            },
            {
                Name: 'Estilo',
                Id: 204
            },
            {
                Name: 'Beneficios',
                Id: 205
            },
            {
                Name: 'Resistencia al Agua',
                Id: 206
            },
            {
                Name: 'Material De Pulso',
                Id: 207
            },
            {
                Name: 'Material de la Caja',
                Id: 208
            },
            {
                Name: 'Tipo de Hora',
                Id: 209
            },
            {
                Name: 'Genero',
                Id: 210
            },
            {
                Name: 'Peso Bruto',
                Id: 211
            },
            {
                Name: 'Peso Neto',
                Id: 212
            },
            {
                Name: 'Color Principal',
                Id: 213
            },
            {
                Name: 'Formato',
                Id: 214
            },
            {
                Name: 'Material Principal',
                Id: 215
            },
            {
                Name: 'Estilo',
                Id: 216
            },
            {
                Name: 'Beneficios',
                Id: 217
            },
            {
                Name: 'Modelo',
                Id: 218
            },
            {
                Name: 'Resistencia',
                Id: 219
            },
            {
                Name: 'Voltaje',
                Id: 220
            },
            {
                Name: 'Tipo de Batería',
                Id: 221
            },
            {
                Name: 'Potencia',
                Id: 222
            },
            {
                Name: 'Especificaciones',
                Id: 223
            },
            {
                Name: 'Compatibilidad',
                Id: 224
            },
            {
                Name: 'Tipo de procesador',
                Id: 225
            },
            {
                Name: 'Sistema de Audio',
                Id: 226
            },
            {
                Name: 'Garantía proveedor',
                Id: 227
            },
            {
                Name: 'Entrada ',
                Id: 228
            },
            {
                Name: 'Conexión USB',
                Id: 229
            },
            {
                Name: 'Dual Sim',
                Id: 230
            },
            {
                Name: 'Conexión',
                Id: 231
            },
            {
                Name: 'Cámara principal',
                Id: 232
            },
            {
                Name: 'Tamaño de pantalla',
                Id: 233
            },
            {
                Name: 'Cámara frontal',
                Id: 234
            },
            {
                Name: 'Tipo de Sim',
                Id: 235
            },
            {
                Name: 'Conectividad',
                Id: 236
            },
            {
                Name: 'Tarjeta de vídeo',
                Id: 237
            },
            {
                Name: 'Cámara web',
                Id: 238
            },
            {
                Name: 'Unidad Óptica',
                Id: 239
            },
            {
                Name: 'Sensor de imagen',
                Id: 240
            },
            {
                Name: 'Sensibilidad ISO',
                Id: 241
            },
            {
                Name: 'Tipo de obturador',
                Id: 242
            },
            {
                Name: 'Velocidad del obturador',
                Id: 243
            },
            {
                Name: 'Diafragma',
                Id: 244
            },
            {
                Name: 'Flash',
                Id: 245
            },
            {
                Name: 'Temporizador',
                Id: 246
            },
            {
                Name: 'Distancia focal',
                Id: 247
            },
            {
                Name: 'Lente',
                Id: 248
            },
            {
                Name: 'Material Principal',
                Id: 249
            },
            {
                Name: 'Tamaño de pantalla',
                Id: 250
            },
            {
                Name: 'Resolución de pantalla',
                Id: 251
            },
            {
                Name: 'Tecnología',
                Id: 252
            },
            {
                Name: 'Modelo',
                Id: 253
            },
            {
                Name: 'Resistencia',
                Id: 254
            },
            {
                Name: 'Voltaje',
                Id: 255
            },
            {
                Name: 'Tipo de Batería',
                Id: 256
            },
            {
                Name: 'Potencia',
                Id: 257
            },
            {
                Name: 'Especificaciones',
                Id: 258
            },
            {
                Name: 'Compatibilidad',
                Id: 259
            },
            {
                Name: 'Sistema de Audio',
                Id: 260
            },
            {
                Name: 'Garantía proveedor',
                Id: 261
            },
            {
                Name: 'Entrada ',
                Id: 262
            },
            {
                Name: 'Conexión USB',
                Id: 263
            },
            {
                Name: 'Tamaño de pantalla',
                Id: 264
            },
            {
                Name: 'Conectividad',
                Id: 265
            },
            {
                Name: 'Material Principal',
                Id: 266
            }
        ]
    }, {
        Name: 'Cámaras',
        Sons: [
            {
                Name: 'Lente',
                Id: 0,
            },
            {
                Name: 'Modelo',
                Id: 1,
            },
            {
                Name: 'Resistencia',
                Id: 2,
            },
            {
                Name: 'Voltaje',
                Id: 3,
            },
            {
                Name: 'Tipo de Batería',
                Id: 4,
            },
            {
                Name: 'Potencia',
                Id: 5,
            },
            {
                Name: 'Especificaciones',
                Id: 6,
            },
            {
                Name: 'Compatibilidad',
                Id: 7,
            },
            {
                Name: 'Garantía proveedor',
                Id: 8,
            },
            {
                Name: 'Entrada ',
                Id: 9,
            },
            {
                Name: 'Conexión USB',
                Id: 10,
            },
            {
                Name: 'Conexión',
                Id: 11,
            },
            {
                Name: 'Unidad Óptica',
                Id: 12,
            },
            {
                Name: 'Sensor de imagen',
                Id: 13,
            },
            {
                Name: 'Sensibilidad ISO',
                Id: 14,
            },
            {
                Name: 'Tipo de obturador',
                Id: 15,
            },
            {
                Name: 'Velocidad del obturador',
                Id: 16,
            },
            {
                Name: 'Diafragma',
                Id: 17,
            },
            {
                Name: 'Flash',
                Id: 18,
            },
            {
                Name: 'Temporizador',
                Id: 19,
            },
            {
                Name: 'Distancia focal',
                Id: 20,
            },
            {
                Name: 'Material Principal',
                Id: 21,
            },

        ]
    }, {
        Name: 'Celulares',
        Sons: [
            {
                Name: 'Sistema operativo',
                Id: 0
            },
            {
                Name: 'Rango de la cámara principal',
                Id: 1
            },
            {
                Name: 'Rango del tamaño de la pantalla',
                Id: 2
            },
            {
                Name: 'Capacidad',
                Id: 3
            },
            {
                Name: 'RAM',
                Id: 4
            },
            {
                Name: 'Memoria Interna',
                Id: 5
            },
            {
                Name: 'Modelo',
                Id: 6
            },
            {
                Name: 'Resistencia',
                Id: 7
            },
            {
                Name: 'Voltaje',
                Id: 8
            },
            {
                Name: 'Tipo de Batería',
                Id: 9
            },
            {
                Name: 'Potencia',
                Id: 10
            },
            {
                Name: 'Especificaciones',
                Id: 11
            },
            {
                Name: 'Compatibilidad',
                Id: 12
            },
            {
                Name: 'Sistema de Audio',
                Id: 13
            },
            {
                Name: 'Garantía proveedor',
                Id: 14
            },
            {
                Name: 'Entrada ',
                Id: 15
            },
            {
                Name: 'Conexión USB',
                Id: 16
            },
            {
                Name: 'Dual Sim',
                Id: 17
            },
            {
                Name: 'Conexión',
                Id: 18
            },
            {
                Name: 'Cámara principal',
                Id: 19
            },
            {
                Name: 'Tamaño de pantalla',
                Id: 20
            },
            {
                Name: 'Cámara frontal',
                Id: 21
            },
            {
                Name: 'Tipo de Sim',
                Id: 22
            },
            {
                Name: 'Conectividad',
                Id: 23
            },
            {
                Name: 'Material Principal',
                Id: 24
            }
        ]
    }];


    const structureJson = {
        statusCode: 200,
        status: 200,
        body: { Data:  specification }
    };

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                SpecificationProductComponent,
                SpecificationDialogComponent
            ],
            providers: [
                { provide: SpecificationService, useValue: specificationService },
                { provide: MatDialogRef, useValue: {} },
            ], imports: [
                MaterialModule,
                MatFormFieldModule,
                ReactiveFormsModule,
                FormsModule,
                BrowserAnimationsModule
            ]
        }).compileComponents();
    }));

    afterAll(() => {
        fixture.destroy();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SpecificationProductComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('Deberia crear el componente', () => {
        expect(component).toBeTruthy();
    });

    it('Deberia crear abrir las especificaciones de "todas las especificaciones" grupo', () => {
        component.toggleSpecification(specification[0] as SpecificationModel, true);
        expect(specification[0].Show).toBeTruthy();
    });

    it('Deberia agregar la primera especificacion. a las lista para ser enviada', () => {
        specification[0]['Value'] = 'hola';
        component.specificationChange(specification[0] as SpecificationModel, 0 , 0);
        expect(component.specificationListToAdd[0].Name).toBe(specification[0].Name);
    });

    it('Deberia cambiar la primera especificacion. a las lista para ser enviada', () => {

        specification[0]['Value'] = 'hola';
        component.specificationChange(specification[0] as SpecificationModel, 0 , 0);

        specification[0]['Value'] = 'hola 2';
        component.specificationChange(specification[0] as SpecificationModel, 0 , 0);
        expect(component.specificationListToAdd[0].Value).toBe(specification[0].Value);
    });

    it('Deberia eliminar la primera especificacion. a las lista para ser enviada', () => {
        specification[0]['Value'] = 'hola';
        component.specificationChange(specification[0] as SpecificationModel, 0 , 0);
        component.removeSpecification(0);
        expect(component.specificationListToAdd.length).toBe(0);
    });

    it('Deberia abrir el dialogo para crear una especificacion', () => {
    });

});
