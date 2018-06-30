/* 3rd party components */
import { Component } from '@angular/core';
import { Router } from '@angular/router';

/* our own custom components */
import { CategoryList } from '../../shared/models/order';
import { Const } from './../../shared/util/constants';

/**
 * Component
 */
@Component({
  selector: 'app-toolbar-link',
  templateUrl: './toolbar-link.component.html',
  styleUrls: ['./toolbar-link.component.scss'],
})

/**
 * Componente Toolbar para los links de la orden
 */
export class ToolbarLinkComponent {

  // Estructura para la categoría
  categoryEstructure = {
    root: 'home'
  };

  // Lista de categorías
  public categoryList: any;

  /**
   * Creates an instance of ToolbarLinkComponent.
   * @param {Router} route
   * @memberof ToolbarLinkComponent
   */
  constructor(private route: Router, ) {
    this.getCategory();
  }

  /**
   * Método par obtener la lista de categorías
   * @memberof ToolbarLinkComponent
   */
  getCategory() {
    this.categoryList = Const.CATEGORYLIST;
  }

  /**
   * Método para envíar al usuario a una ruta en especifica
   * @param {CategoryList} category
   * @memberof ToolbarLinkComponent
   */
  goToRoot(category: CategoryList) {
    if (category.id !== '') {
      this.route.navigate([category.root, category.id]);
    }else {
      this.route.navigate([category.root]);
    }
  }
}
