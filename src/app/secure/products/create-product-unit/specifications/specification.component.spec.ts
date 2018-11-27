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
        idGroup: 1,
        groupName: 'Todas las Especificaciones',
        Show: false,
        Value: null,
        specs: [
            {
                idSpec: 2,
                specName: 'Lente'
            }, {
                idSpec: 3,
                specName: 'Modelo'
            }, {
                idSpec: 4,
                specName: 'Resistencia'
            }, {
                idSpec: 5,
                specName: 'Voltaje'
            }, {
                idSpec: 6,
                specName: 'Tipo de Batería'
            }, {
                idSpec: 7,
                specName: 'Potencia'
            }, {
                specName: 'Especificaciones',
                idSpec: 0
            },
            {
                specName: 'Compatibilidad',
                idSpec: 1
            },
            {
                specName: 'Garantía proveedor',
                idSpec: 2
            },
            {
                specName: 'Entrada ',
                idSpec: 3
            },
            {
                specName: 'Conexión USB',
                idSpec: 4
            },
            {
                specName: 'Conexión',
                idSpec: 5
            },
            {
                specName: 'Unidad Óptica',
                idSpec: 6
            },
            {
                specName: 'Sensor de imagen',
                idSpec: 7
            },
            {
                specName: 'Sensibilidad ISO',
                idSpec: 8
            },
            {
                specName: 'Tipo de obturador',
                idSpec: 9
            },
            {
                specName: 'Velocidad del obturador',
                idSpec: 10
            },
            {
                specName: 'Diafragma',
                idSpec: 11
            },
            {
                specName: 'Flash',
                idSpec: 12
            },
            {
                specName: 'Temporizador',
                idSpec: 13
            },
            {
                specName: 'Distancia focal',
                idSpec: 14
            },
            {
                specName: 'Material Principal',
                idSpec: 15
            },
            {
                specName: 'Sistema operativo',
                idSpec: 16
            },
            {
                specName: 'Rango de la cámara principal',
                idSpec: 17
            },
            {
                specName: 'Rango del tamaño de la pantalla',
                idSpec: 18
            },
            {
                specName: 'Capacidad',
                idSpec: 19
            },
            {
                specName: 'RAM',
                idSpec: 20
            },
            {
                specName: 'Memoria Interna',
                idSpec: 21
            },
            {
                specName: 'Modelo',
                idSpec: 22
            },
            {
                specName: 'Resistencia',
                idSpec: 23
            },
            {
                specName: 'Voltaje',
                idSpec: 24
            },
            {
                specName: 'Tipo de Batería',
                idSpec: 25
            },
            {
                specName: 'Potencia',
                idSpec: 26
            },
            {
                specName: 'Especificaciones',
                idSpec: 27
            },
            {
                specName: 'Compatibilidad',
                idSpec: 28
            },
            {
                specName: 'Sistema de Audio',
                idSpec: 29
            },
            {
                specName: 'Garantía proveedor',
                idSpec: 30
            },
            {
                specName: 'Entrada ',
                idSpec: 31
            },
            {
                specName: 'Conexión USB',
                idSpec: 32
            },
            {
                specName: 'Dual Sim',
                idSpec: 33
            },
            {
                specName: 'Conexión',
                idSpec: 34
            },
            {
                specName: 'Cámara principal',
                idSpec: 35
            },
            {
                specName: 'Tamaño de pantalla',
                idSpec: 36
            },
            {
                specName: 'Cámara frontal',
                idSpec: 37
            },
            {
                specName: 'Tipo de Sim',
                idSpec: 38
            },
            {
                specName: 'Conectividad',
                idSpec: 39
            },
            {
                specName: 'Material Principal',
                idSpec: 40
            },
            {
                specName: 'Tamaño',
                idSpec: 41
            },
            {
                specName: 'Tipo',
                idSpec: 42
            },
            {
                specName: 'Confort',
                idSpec: 43
            },
            {
                specName: 'Peso promedio por persona',
                idSpec: 44
            },
            {
                specName: 'Gama',
                idSpec: 45
            },
            {
                specName: 'Material Principal',
                idSpec: 46
            },
            {
                specName: 'Modelo',
                idSpec: 47
            },
            {
                specName: 'Carga útil',
                idSpec: 48
            },
            {
                specName: 'Resistencia',
                idSpec: 49
            },
            {
                specName: 'Licencia',
                idSpec: 50
            },
            {
                specName: 'Especificaciones',
                idSpec: 51
            },
            {
                specName: 'Compatibilidad',
                idSpec: 52
            },
            {
                specName: 'Fabricante',
                idSpec: 53
            },
            {
                specName: 'Edades',
                idSpec: 54
            },
            {
                specName: 'Garantía proveedor',
                idSpec: 55
            },
            {
                specName: 'Información adicional',
                idSpec: 56
            },
            {
                specName: 'Brillo',
                idSpec: 57
            },
            {
                specName: 'Material Principal',
                idSpec: 58
            },
            {
                specName: 'Especificaciones',
                idSpec: 59
            },
            {
                specName: 'Compatibilidad',
                idSpec: 60
            },
            {
                specName: 'Fabricante',
                idSpec: 61
            },
            {
                specName: 'Edad',
                idSpec: 62
            },
            {
                specName: 'Modelo',
                idSpec: 63
            },
            {
                specName: 'Resistencia',
                idSpec: 64
            },
            {
                specName: 'Voltaje',
                idSpec: 65
            },
            {
                specName: 'Potencia',
                idSpec: 66
            },
            {
                specName: 'Especificaciones',
                idSpec: 67
            },
            {
                specName: 'Compatibilidad',
                idSpec: 68
            },
            {
                specName: 'Tipo de Instrumento',
                idSpec: 69
            },
            {
                specName: 'Información adicional',
                idSpec: 70
            },
            {
                specName: 'Conexión USB',
                idSpec: 71
            },
            {
                specName: 'Capacidad',
                idSpec: 72
            },
            {
                specName: 'Tipo',
                idSpec: 73
            },
            {
                specName: 'Estilo',
                idSpec: 74
            },
            {
                specName: 'Referencia',
                idSpec: 75
            },
            {
                specName: 'Beneficio',
                idSpec: 76
            },
            {
                specName: 'Tipo de panel',
                idSpec: 77
            },
            {
                specName: 'Peso Neto',
                idSpec: 78
            },
            {
                specName: 'Peso Bruto',
                idSpec: 79
            },
            {
                specName: 'Voltaje',
                idSpec: 80
            },
            {
                specName: 'Material principal ',
                idSpec: 81
            },
            {
                specName: 'Genero',
                idSpec: 82
            },
            {
                specName: 'Color Marco',
                idSpec: 83
            },
            {
                specName: 'Color Lente',
                idSpec: 84
            },
            {
                specName: 'Ancho de Lente',
                idSpec: 85
            },
            {
                specName: 'Largo de Puente',
                idSpec: 86
            },
            {
                specName: 'Largo de Varilla',
                idSpec: 87
            },
            {
                specName: 'Peso Bruto',
                idSpec: 88
            },
            {
                specName: 'Peso Neto',
                idSpec: 89
            },
            {
                specName: 'Color Principal',
                idSpec: 90
            },
            {
                specName: 'Formato',
                idSpec: 91
            },
            {
                specName: 'Material Principal',
                idSpec: 92
            },
            {
                specName: 'Estilo',
                idSpec: 93
            },
            {
                specName: 'Beneficios',
                idSpec: 94
            },
            {
                specName: 'Material Principal',
                idSpec: 95
            },
            {
                specName: 'Modelo',
                idSpec: 96
            },
            {
                specName: 'Carga útil',
                idSpec: 97
            },
            {
                specName: 'Resistencia',
                idSpec: 98
            },
            {
                specName: 'Licencia',
                idSpec: 99
            },
            {
                specName: 'Especificaciones',
                idSpec: 100
            },
            {
                specName: 'Compatibilidad',
                idSpec: 101
            },
            {
                specName: 'Fabricante',
                idSpec: 102
            },
            {
                specName: 'Edades',
                idSpec: 103
            },
            {
                specName: 'Garantía proveedor',
                idSpec: 104
            },
            {
                specName: 'Información adicional',
                idSpec: 105
            },
            {
                specName: 'Brillo',
                idSpec: 106
            },
            {
                specName: 'Tamaño de pantalla',
                idSpec: 107
            },
            {
                specName: 'Resolución de pantalla',
                idSpec: 108
            },
            {
                specName: 'Familia de procesador',
                idSpec: 109
            },
            {
                specName: 'Sistema operativo',
                idSpec: 110
            },
            {
                specName: 'Capacidad de disco duro',
                idSpec: 111
            },
            {
                specName: 'Memoria del sistema (RAM)',
                idSpec: 112
            },
            {
                specName: 'Modelo',
                idSpec: 113
            },
            {
                specName: 'Resistencia',
                idSpec: 114
            },
            {
                specName: 'Voltaje',
                idSpec: 115
            },
            {
                specName: 'Tipo de Batería',
                idSpec: 116
            },
            {
                specName: 'Potencia',
                idSpec: 117
            },
            {
                specName: 'Especificaciones',
                idSpec: 118
            },
            {
                specName: 'Compatibilidad',
                idSpec: 119
            },
            {
                specName: 'Tipo de procesador',
                idSpec: 120
            },
            {
                specName: 'Sistema de Audio',
                idSpec: 121
            },
            {
                specName: 'Garantía proveedor',
                idSpec: 122
            },
            {
                specName: 'Entrada ',
                idSpec: 123
            },
            {
                specName: 'Conexión USB',
                idSpec: 124
            },
            {
                specName: 'Tamaño de pantalla',
                idSpec: 125
            },
            {
                specName: 'Cámara frontal',
                idSpec: 126
            },
            {
                specName: 'Conectividad',
                idSpec: 127
            },
            {
                specName: 'Tarjeta de vídeo',
                idSpec: 128
            },
            {
                specName: 'Cámara web',
                idSpec: 129
            },
            {
                specName: 'Unidad Óptica',
                idSpec: 130
            },
            {
                specName: 'Material Principal',
                idSpec: 131
            },
            {
                specName: 'Capacidad en libras',
                idSpec: 132
            },
            {
                specName: 'Capacidad en Kilogramos',
                idSpec: 133
            },
            {
                specName: 'Tipo de carga',
                idSpec: 134
            },
            {
                specName: 'Modelo',
                idSpec: 135
            },
            {
                specName: 'Resistencia',
                idSpec: 136
            },
            {
                specName: 'Voltaje',
                idSpec: 137
            },
            {
                specName: 'Potencia',
                idSpec: 138
            },
            {
                specName: 'Especificaciones',
                idSpec: 139
            },
            {
                specName: 'Compatibilidad',
                idSpec: 140
            },
            {
                specName: 'Tipo de Instrumento',
                idSpec: 141
            },
            {
                specName: 'Información adicional',
                idSpec: 142
            },
            {
                specName: 'Capacidad',
                idSpec: 143
            },
            {
                specName: 'Tipo',
                idSpec: 144
            },
            {
                specName: 'Estilo',
                idSpec: 145
            },
            {
                specName: 'Referencia',
                idSpec: 146
            },
            {
                specName: 'Beneficio',
                idSpec: 147
            },
            {
                specName: 'Tipo de panel',
                idSpec: 148
            },
            {
                specName: 'Peso Neto',
                idSpec: 149
            },
            {
                specName: 'Peso Bruto',
                idSpec: 150
            },
            {
                specName: 'Material principal ',
                idSpec: 151
            },
            {
                specName: 'Diámetro de Neumático',
                idSpec: 152
            },
            {
                specName: 'Largo de Neumático',
                idSpec: 153
            },
            {
                specName: 'Altura del Neumático',
                idSpec: 154
            },
            {
                specName: 'Ancho (Llanta)',
                idSpec: 155
            },
            {
                specName: 'Perfil (Llanta)',
                idSpec: 156
            },
            {
                specName: 'Radial (Llanta)',
                idSpec: 157
            },
            {
                specName: 'Cilindraje (Litros)',
                idSpec: 158
            },
            {
                specName: 'Resistencia',
                idSpec: 159
            },
            {
                specName: 'Genero',
                idSpec: 160
            },
            {
                specName: 'Peso Bruto',
                idSpec: 161
            },
            {
                specName: 'Peso Neto',
                idSpec: 162
            },
            {
                specName: 'Color Principal',
                idSpec: 163
            },
            {
                specName: 'Formato',
                idSpec: 164
            },
            {
                specName: 'Material Principal',
                idSpec: 165
            },
            {
                specName: 'Estilo',
                idSpec: 166
            },
            {
                specName: 'Beneficios',
                idSpec: 167
            },
            {
                specName: 'Referencia',
                idSpec: 168
            },
            {
                specName: 'Resistencia al Agua',
                idSpec: 169
            },
            {
                specName: 'Material De Pulso',
                idSpec: 170
            },
            {
                specName: 'Material de la Caja',
                idSpec: 171
            },
            {
                specName: 'Tipo de Hora',
                idSpec: 172
            },
            {
                specName: 'INVIMA',
                idSpec: 173
            },
            {
                specName: 'Rango de litros',
                idSpec: 174
            },
            {
                specName: 'Dispensador de agua',
                idSpec: 175
            },
            {
                specName: 'Dispensador de hielo',
                idSpec: 176
            },
            {
                specName: 'Modelo',
                idSpec: 177
            },
            {
                specName: 'Resistencia',
                idSpec: 178
            },
            {
                specName: 'Voltaje',
                idSpec: 179
            },
            {
                specName: 'Potencia',
                idSpec: 180
            },
            {
                specName: 'Especificaciones',
                idSpec: 181
            },
            {
                specName: 'Compatibilidad',
                idSpec: 182
            },
            {
                specName: 'Tipo de Instrumento',
                idSpec: 183
            },
            {
                specName: 'Información adicional',
                idSpec: 184
            },
            {
                specName: 'Conexión USB',
                idSpec: 185
            },
            {
                specName: 'Capacidad',
                idSpec: 186
            },
            {
                specName: 'Tipo',
                idSpec: 187
            },
            {
                specName: 'Estilo',
                idSpec: 188
            },
            {
                specName: 'Referencia',
                idSpec: 189
            },
            {
                specName: 'Beneficio',
                idSpec: 190
            },
            {
                specName: 'Tipo de panel',
                idSpec: 191
            },
            {
                specName: 'Peso Neto',
                idSpec: 192
            },
            {
                specName: 'Peso Bruto',
                idSpec: 193
            },
            {
                specName: 'Voltaje',
                idSpec: 194
            },
            {
                specName: 'Material principal ',
                idSpec: 195
            },
            {
                specName: 'Tamaño',
                idSpec: 196
            },
            {
                specName: 'Concentracion',
                idSpec: 197
            },
            {
                specName: 'Genero',
                idSpec: 198
            },
            {
                specName: 'Peso Bruto',
                idSpec: 199
            },
            {
                specName: 'Peso Neto',
                idSpec: 200
            },
            {
                specName: 'Color Principal',
                idSpec: 201
            },
            {
                specName: 'Formato',
                idSpec: 202
            },
            {
                specName: 'Material Principal',
                idSpec: 203
            },
            {
                specName: 'Estilo',
                idSpec: 204
            },
            {
                specName: 'Beneficios',
                idSpec: 205
            },
            {
                specName: 'Resistencia al Agua',
                idSpec: 206
            },
            {
                specName: 'Material De Pulso',
                idSpec: 207
            },
            {
                specName: 'Material de la Caja',
                idSpec: 208
            },
            {
                specName: 'Tipo de Hora',
                idSpec: 209
            },
            {
                specName: 'Genero',
                idSpec: 210
            },
            {
                specName: 'Peso Bruto',
                idSpec: 211
            },
            {
                specName: 'Peso Neto',
                idSpec: 212
            },
            {
                specName: 'Color Principal',
                idSpec: 213
            },
            {
                specName: 'Formato',
                idSpec: 214
            },
            {
                specName: 'Material Principal',
                idSpec: 215
            },
            {
                specName: 'Estilo',
                idSpec: 216
            },
            {
                specName: 'Beneficios',
                idSpec: 217
            },
            {
                specName: 'Modelo',
                idSpec: 218
            },
            {
                specName: 'Resistencia',
                idSpec: 219
            },
            {
                specName: 'Voltaje',
                idSpec: 220
            },
            {
                specName: 'Tipo de Batería',
                idSpec: 221
            },
            {
                specName: 'Potencia',
                idSpec: 222
            },
            {
                specName: 'Especificaciones',
                idSpec: 223
            },
            {
                specName: 'Compatibilidad',
                idSpec: 224
            },
            {
                specName: 'Tipo de procesador',
                idSpec: 225
            },
            {
                specName: 'Sistema de Audio',
                idSpec: 226
            },
            {
                specName: 'Garantía proveedor',
                idSpec: 227
            },
            {
                specName: 'Entrada ',
                idSpec: 228
            },
            {
                specName: 'Conexión USB',
                idSpec: 229
            },
            {
                specName: 'Dual Sim',
                idSpec: 230
            },
            {
                specName: 'Conexión',
                idSpec: 231
            },
            {
                specName: 'Cámara principal',
                idSpec: 232
            },
            {
                specName: 'Tamaño de pantalla',
                idSpec: 233
            },
            {
                specName: 'Cámara frontal',
                idSpec: 234
            },
            {
                specName: 'Tipo de Sim',
                idSpec: 235
            },
            {
                specName: 'Conectividad',
                idSpec: 236
            },
            {
                specName: 'Tarjeta de vídeo',
                idSpec: 237
            },
            {
                specName: 'Cámara web',
                idSpec: 238
            },
            {
                specName: 'Unidad Óptica',
                idSpec: 239
            },
            {
                specName: 'Sensor de imagen',
                idSpec: 240
            },
            {
                specName: 'Sensibilidad ISO',
                idSpec: 241
            },
            {
                specName: 'Tipo de obturador',
                idSpec: 242
            },
            {
                specName: 'Velocidad del obturador',
                idSpec: 243
            },
            {
                specName: 'Diafragma',
                idSpec: 244
            },
            {
                specName: 'Flash',
                idSpec: 245
            },
            {
                specName: 'Temporizador',
                idSpec: 246
            },
            {
                specName: 'Distancia focal',
                idSpec: 247
            },
            {
                specName: 'Lente',
                idSpec: 248
            },
            {
                specName: 'Material Principal',
                idSpec: 249
            },
            {
                specName: 'Tamaño de pantalla',
                idSpec: 250
            },
            {
                specName: 'Resolución de pantalla',
                idSpec: 251
            },
            {
                specName: 'Tecnología',
                idSpec: 252
            },
            {
                specName: 'Modelo',
                idSpec: 253
            },
            {
                specName: 'Resistencia',
                idSpec: 254
            },
            {
                specName: 'Voltaje',
                idSpec: 255
            },
            {
                specName: 'Tipo de Batería',
                idSpec: 256
            },
            {
                specName: 'Potencia',
                idSpec: 257
            },
            {
                specName: 'Especificaciones',
                idSpec: 258
            },
            {
                specName: 'Compatibilidad',
                idSpec: 259
            },
            {
                specName: 'Sistema de Audio',
                idSpec: 260
            },
            {
                specName: 'Garantía proveedor',
                idSpec: 261
            },
            {
                specName: 'Entrada ',
                idSpec: 262
            },
            {
                specName: 'Conexión USB',
                idSpec: 263
            },
            {
                specName: 'Tamaño de pantalla',
                idSpec: 264
            },
            {
                specName: 'Conectividad',
                idSpec: 265
            },
            {
                specName: 'Material Principal',
                idSpec: 266
            }
        ]
    }, {
        specName: 'Cámaras',
        specs: [
            {
                specName: 'Lente',
                idSpec: 0,
            },
            {
                specName: 'Modelo',
                idSpec: 1,
            },
            {
                specName: 'Resistencia',
                idSpec: 2,
            },
            {
                specName: 'Voltaje',
                idSpec: 3,
            },
            {
                specName: 'Tipo de Batería',
                idSpec: 4,
            },
            {
                specName: 'Potencia',
                idSpec: 5,
            },
            {
                specName: 'Especificaciones',
                idSpec: 6,
            },
            {
                specName: 'Compatibilidad',
                idSpec: 7,
            },
            {
                specName: 'Garantía proveedor',
                idSpec: 8,
            },
            {
                specName: 'Entrada ',
                idSpec: 9,
            },
            {
                specName: 'Conexión USB',
                idSpec: 10,
            },
            {
                specName: 'Conexión',
                idSpec: 11,
            },
            {
                specName: 'Unidad Óptica',
                idSpec: 12,
            },
            {
                specName: 'Sensor de imagen',
                idSpec: 13,
            },
            {
                specName: 'Sensibilidad ISO',
                idSpec: 14,
            },
            {
                specName: 'Tipo de obturador',
                idSpec: 15,
            },
            {
                specName: 'Velocidad del obturador',
                idSpec: 16,
            },
            {
                specName: 'Diafragma',
                idSpec: 17,
            },
            {
                specName: 'Flash',
                idSpec: 18,
            },
            {
                specName: 'Temporizador',
                idSpec: 19,
            },
            {
                specName: 'Distancia focal',
                idSpec: 20,
            },
            {
                specName: 'Material Principal',
                idSpec: 21,
            },

        ]
    }, {
        specName: 'Celulares',
        specs: [
            {
                specName: 'Sistema operativo',
                idSpec: 0
            },
            {
                specName: 'Rango de la cámara principal',
                idSpec: 1
            },
            {
                specName: 'Rango del tamaño de la pantalla',
                idSpec: 2
            },
            {
                specName: 'Capacidad',
                idSpec: 3
            },
            {
                specName: 'RAM',
                idSpec: 4
            },
            {
                specName: 'Memoria Interna',
                idSpec: 5
            },
            {
                specName: 'Modelo',
                idSpec: 6
            },
            {
                specName: 'Resistencia',
                idSpec: 7
            },
            {
                specName: 'Voltaje',
                idSpec: 8
            },
            {
                specName: 'Tipo de Batería',
                idSpec: 9
            },
            {
                specName: 'Potencia',
                idSpec: 10
            },
            {
                specName: 'Especificaciones',
                idSpec: 11
            },
            {
                specName: 'Compatibilidad',
                idSpec: 12
            },
            {
                specName: 'Sistema de Audio',
                idSpec: 13
            },
            {
                specName: 'Garantía proveedor',
                idSpec: 14
            },
            {
                specName: 'Entrada ',
                idSpec: 15
            },
            {
                specName: 'Conexión USB',
                idSpec: 16
            },
            {
                specName: 'Dual Sim',
                idSpec: 17
            },
            {
                specName: 'Conexión',
                idSpec: 18
            },
            {
                specName: 'Cámara principal',
                idSpec: 19
            },
            {
                specName: 'Tamaño de pantalla',
                idSpec: 20
            },
            {
                specName: 'Cámara frontal',
                idSpec: 21
            },
            {
                specName: 'Tipo de Sim',
                idSpec: 22
            },
            {
                specName: 'Conectividad',
                idSpec: 23
            },
            {
                specName: 'Material Principal',
                idSpec: 24
            }
        ]
    }];
    const specificationModel2 = new SpecificationModel(specification[0].specName, false, [], specification[0].idGroup);

    const structureJson = {
        statusCode: 200,
        status: 200,
        body: { data:  specification  }
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

    it('Deberia crear el componente SpecificationProductComponent', () => {
        expect(component).toBeTruthy();
    });

    it('Deberia crear abrir las especificaciones de "todas las especificaciones" grupo', () => {
        component.toggleSpecification(specificationModel2, true);
        expect(specificationModel2).toBeTruthy();
    });

    it('Deberia agregar la primera especificacion. a las lista para ser enviada', () => {
        specification[0]['Value'] = 'hola';
        component.specificationChange(specificationModel2, 0 , 0);
        expect(component.specificationListToAdd[0].Name).toBe(specification[0].specName);
    });

    it('Deberia cambiar la primera especificacion. a las lista para ser enviada', () => {

        specificationModel2.Value  = 'hola';
        component.specificationChange(specificationModel2, 0 , 0);

        specificationModel2.Value = 'hola 2';
        component.specificationChange(specificationModel2, 0 , 0);
        expect(component.specificationListToAdd[0].Value).toBe(specificationModel2.Value );
    });

    it('Deberia eliminar la primera especificacion. a las lista para ser enviada', () => {
        specificationModel2.Value  = 'hola';
        component.specificationChange(specificationModel2, 0 , 0);
        component.removeSpecification(0);
        expect(component.specificationListToAdd.length).toBe(0);
    });

});
