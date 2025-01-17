'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`<nav>
    <ul class="list">
        <li class="title">
            <a href="index.html" data-type="index-link">Seller Center documentation</a>
        </li>
        <li class="divider"></li>
        ${ isNormalMode ? `<div id="book-search-input" role="search">
    <input type="text" placeholder="Type to search">
</div>
` : '' }
        <li class="chapter">
            <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
            <ul class="links">
                    <li class="link">
                        <a href="overview.html" data-type="chapter-link">
                            <span class="icon ion-ios-keypad"></span>Overview
                        </a>
                    </li>
                    <li class="link">
                        <a href="index.html" data-type="chapter-link">
                            <span class="icon ion-ios-paper"></span>README
                        </a>
                    </li>
                    <li class="link">
                            <a href="changelog.html"
                        data-type="chapter-link">
                            <span class="icon ion-ios-paper"></span>CHANGELOG
                        </a>
                    </li>
                    <li class="link">
                            <a href="contributing.html"
                        data-type="chapter-link">
                            <span class="icon ion-ios-paper"></span>CONTRIBUTING
                        </a>
                    </li>
                    <li class="link">
                            <a href="license.html"
                        data-type="chapter-link">
                            <span class="icon ion-ios-paper"></span>LICENSE
                        </a>
                    </li>
                    <li class="link">
                            <a href="todo.html"
                        data-type="chapter-link">
                            <span class="icon ion-ios-paper"></span>TODO
                        </a>
                    </li>
                    <li class="link">
                        <a href="dependencies.html"
                            data-type="chapter-link">
                            <span class="icon ion-ios-list"></span>Dependencies
                        </a>
                    </li>
            </ul>
        </li>
        <li class="chapter modules">
            <a data-type="chapter-link" href="modules.html">
                <div class="menu-toggler linked" data-toggle="collapse"
                    ${ isNormalMode ? 'data-target="#modules-links"' : 'data-target="#xs-modules-links"' }>
                    <span class="icon ion-ios-archive"></span>
                    <span class="link-name">Modules</span>
                    <span class="icon ion-ios-arrow-down"></span>
                </div>
            </a>
            <ul class="links collapse"
            ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                    <li class="link">
                        <a href="modules/AppModule.html" data-type="entity-link">AppModule</a>
                            <li class="chapter inner">
                                <div class="simple menu-toggler" data-toggle="collapse"
                                    ${ isNormalMode ? 'data-target="#components-links-module-AppModule-40f851b1eb9ff8485e4f7bbac9ae76b7"' : 'data-target="#xs-components-links-module-AppModule-40f851b1eb9ff8485e4f7bbac9ae76b7"' }>
                                    <span class="icon ion-md-cog"></span>
                                    <span>Components</span>
                                    <span class="icon ion-ios-arrow-down"></span>
                                </div>
                                <ul class="links collapse"
                                    ${ isNormalMode ? 'id="components-links-module-AppModule-40f851b1eb9ff8485e4f7bbac9ae76b7"' : 'id="xs-components-links-module-AppModule-40f851b1eb9ff8485e4f7bbac9ae76b7"' }>
                                        <li class="link">
                                            <a href="components/AppComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">AppComponent</a>
                                        </li>
                                </ul>
                            </li>
                    </li>
                    <li class="link">
                        <a href="modules/AppRoutingModule.html" data-type="entity-link">AppRoutingModule</a>
                    </li>
                    <li class="link">
                        <a href="modules/AppServerModule.html" data-type="entity-link">AppServerModule</a>
                            <li class="chapter inner">
                                <div class="simple menu-toggler" data-toggle="collapse"
                                    ${ isNormalMode ? 'data-target="#components-links-module-AppServerModule-f785a4195ce4b43c08bc43576194cef2"' : 'data-target="#xs-components-links-module-AppServerModule-f785a4195ce4b43c08bc43576194cef2"' }>
                                    <span class="icon ion-md-cog"></span>
                                    <span>Components</span>
                                    <span class="icon ion-ios-arrow-down"></span>
                                </div>
                                <ul class="links collapse"
                                    ${ isNormalMode ? 'id="components-links-module-AppServerModule-f785a4195ce4b43c08bc43576194cef2"' : 'id="xs-components-links-module-AppServerModule-f785a4195ce4b43c08bc43576194cef2"' }>
                                        <li class="link">
                                            <a href="components/AppComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">AppComponent</a>
                                        </li>
                                </ul>
                            </li>
                    </li>
                    <li class="link">
                        <a href="modules/AwsCognitoModule.html" data-type="entity-link">AwsCognitoModule</a>
                            <li class="chapter inner">
                                <div class="simple menu-toggler" data-toggle="collapse"
                                    ${ isNormalMode ? 'data-target="#components-links-module-AwsCognitoModule-f99b4a6d3235d8d87a7759b0041bbc9a"' : 'data-target="#xs-components-links-module-AwsCognitoModule-f99b4a6d3235d8d87a7759b0041bbc9a"' }>
                                    <span class="icon ion-md-cog"></span>
                                    <span>Components</span>
                                    <span class="icon ion-ios-arrow-down"></span>
                                </div>
                                <ul class="links collapse"
                                    ${ isNormalMode ? 'id="components-links-module-AwsCognitoModule-f99b4a6d3235d8d87a7759b0041bbc9a"' : 'id="xs-components-links-module-AwsCognitoModule-f99b4a6d3235d8d87a7759b0041bbc9a"' }>
                                        <li class="link">
                                            <a href="components/JwtComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">JwtComponent</a>
                                        </li>
                                        <li class="link">
                                            <a href="components/MyProfileComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">MyProfileComponent</a>
                                        </li>
                                        <li class="link">
                                            <a href="components/SecureHomeComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">SecureHomeComponent</a>
                                        </li>
                                        <li class="link">
                                            <a href="components/UseractivityComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">UseractivityComponent</a>
                                        </li>
                                </ul>
                            </li>
                    </li>
                    <li class="link">
                        <a href="modules/AwsCognitoRoutingModule.html" data-type="entity-link">AwsCognitoRoutingModule</a>
                    </li>
                    <li class="link">
                        <a href="modules/BillingModule.html" data-type="entity-link">BillingModule</a>
                            <li class="chapter inner">
                                <div class="simple menu-toggler" data-toggle="collapse"
                                    ${ isNormalMode ? 'data-target="#components-links-module-BillingModule-fb658302de4b3a793ac0c7bde13162c6"' : 'data-target="#xs-components-links-module-BillingModule-fb658302de4b3a793ac0c7bde13162c6"' }>
                                    <span class="icon ion-md-cog"></span>
                                    <span>Components</span>
                                    <span class="icon ion-ios-arrow-down"></span>
                                </div>
                                <ul class="links collapse"
                                    ${ isNormalMode ? 'id="components-links-module-BillingModule-fb658302de4b3a793ac0c7bde13162c6"' : 'id="xs-components-links-module-BillingModule-fb658302de4b3a793ac0c7bde13162c6"' }>
                                        <li class="link">
                                            <a href="components/BillingComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">BillingComponent</a>
                                        </li>
                                        <li class="link">
                                            <a href="components/BillingFulfillmentDetailComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">BillingFulfillmentDetailComponent</a>
                                        </li>
                                        <li class="link">
                                            <a href="components/BillingProductsOrderComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">BillingProductsOrderComponent</a>
                                        </li>
                                        <li class="link">
                                            <a href="components/OrderBillingDetailModalComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">OrderBillingDetailModalComponent</a>
                                        </li>
                                        <li class="link">
                                            <a href="components/ProductDetailBillingModalComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">ProductDetailBillingModalComponent</a>
                                        </li>
                                </ul>
                            </li>
                            <li class="chapter inner">
                                <div class="simple menu-toggler" data-toggle="collapse"
                                    ${ isNormalMode ? 'data-target="#injectables-links-module-BillingModule-fb658302de4b3a793ac0c7bde13162c6"' : 'data-target="#xs-injectables-links-module-BillingModule-fb658302de4b3a793ac0c7bde13162c6"' }>
                                    <span class="icon ion-md-arrow-round-down"></span>
                                    <span>Injectables</span>
                                    <span class="icon ion-ios-arrow-down"></span>
                                </div>
                                <ul class="links collapse"
                                    ${ isNormalMode ? 'id="injectables-links-module-BillingModule-fb658302de4b3a793ac0c7bde13162c6"' : 'id="xs-injectables-links-module-BillingModule-fb658302de4b3a793ac0c7bde13162c6"' }>
                                        <li class="link">
                                            <a href="injectables/BillingService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules"}>BillingService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/CognitoUtil.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules"}>CognitoUtil</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/ComponentsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules"}>ComponentsService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/EventEmitterOrders.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules"}>EventEmitterOrders</a>
                                        </li>
                                </ul>
                            </li>
                    </li>
                    <li class="link">
                        <a href="modules/BillingRoutingModule.html" data-type="entity-link">BillingRoutingModule</a>
                    </li>
                    <li class="link">
                        <a href="modules/BillingRoutingModule.html" data-type="entity-link">BillingRoutingModule</a>
                    </li>
                    <li class="link">
                        <a href="modules/BulkLoadModule.html" data-type="entity-link">BulkLoadModule</a>
                            <li class="chapter inner">
                                <div class="simple menu-toggler" data-toggle="collapse"
                                    ${ isNormalMode ? 'data-target="#components-links-module-BulkLoadModule-f0663d05b226c17049e807278c548c3e"' : 'data-target="#xs-components-links-module-BulkLoadModule-f0663d05b226c17049e807278c548c3e"' }>
                                    <span class="icon ion-md-cog"></span>
                                    <span>Components</span>
                                    <span class="icon ion-ios-arrow-down"></span>
                                </div>
                                <ul class="links collapse"
                                    ${ isNormalMode ? 'id="components-links-module-BulkLoadModule-f0663d05b226c17049e807278c548c3e"' : 'id="xs-components-links-module-BulkLoadModule-f0663d05b226c17049e807278c548c3e"' }>
                                        <li class="link">
                                            <a href="components/BulkLoadComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">BulkLoadComponent</a>
                                        </li>
                                        <li class="link">
                                            <a href="components/FinishUploadInformationComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">FinishUploadInformationComponent</a>
                                        </li>
                                        <li class="link">
                                            <a href="components/TableErrorsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">TableErrorsComponent</a>
                                        </li>
                                        <li class="link">
                                            <a href="components/TableLoadComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">TableLoadComponent</a>
                                        </li>
                                </ul>
                            </li>
                            <li class="chapter inner">
                                <div class="simple menu-toggler" data-toggle="collapse"
                                    ${ isNormalMode ? 'data-target="#injectables-links-module-BulkLoadModule-f0663d05b226c17049e807278c548c3e"' : 'data-target="#xs-injectables-links-module-BulkLoadModule-f0663d05b226c17049e807278c548c3e"' }>
                                    <span class="icon ion-md-arrow-round-down"></span>
                                    <span>Injectables</span>
                                    <span class="icon ion-ios-arrow-down"></span>
                                </div>
                                <ul class="links collapse"
                                    ${ isNormalMode ? 'id="injectables-links-module-BulkLoadModule-f0663d05b226c17049e807278c548c3e"' : 'id="xs-injectables-links-module-BulkLoadModule-f0663d05b226c17049e807278c548c3e"' }>
                                        <li class="link">
                                            <a href="injectables/BulkLoadService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules"}>BulkLoadService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/ComponentsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules"}>ComponentsService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/EventEmitterOrders.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules"}>EventEmitterOrders</a>
                                        </li>
                                </ul>
                            </li>
                    </li>
                    <li class="link">
                        <a href="modules/BulkLoadProductModule.html" data-type="entity-link">BulkLoadProductModule</a>
                            <li class="chapter inner">
                                <div class="simple menu-toggler" data-toggle="collapse"
                                    ${ isNormalMode ? 'data-target="#components-links-module-BulkLoadProductModule-a45883ad3168eda1c9f9e1031d9e64b2"' : 'data-target="#xs-components-links-module-BulkLoadProductModule-a45883ad3168eda1c9f9e1031d9e64b2"' }>
                                    <span class="icon ion-md-cog"></span>
                                    <span>Components</span>
                                    <span class="icon ion-ios-arrow-down"></span>
                                </div>
                                <ul class="links collapse"
                                    ${ isNormalMode ? 'id="components-links-module-BulkLoadProductModule-a45883ad3168eda1c9f9e1031d9e64b2"' : 'id="xs-components-links-module-BulkLoadProductModule-a45883ad3168eda1c9f9e1031d9e64b2"' }>
                                        <li class="link">
                                            <a href="components/BulkLoadProductComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">BulkLoadProductComponent</a>
                                        </li>
                                        <li class="link">
                                            <a href="components/FinishUploadProductInformationComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">FinishUploadProductInformationComponent</a>
                                        </li>
                                        <li class="link">
                                            <a href="components/TableErrorsProductComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">TableErrorsProductComponent</a>
                                        </li>
                                        <li class="link">
                                            <a href="components/TableLoadProductComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">TableLoadProductComponent</a>
                                        </li>
                                </ul>
                            </li>
                            <li class="chapter inner">
                                <div class="simple menu-toggler" data-toggle="collapse"
                                    ${ isNormalMode ? 'data-target="#injectables-links-module-BulkLoadProductModule-a45883ad3168eda1c9f9e1031d9e64b2"' : 'data-target="#xs-injectables-links-module-BulkLoadProductModule-a45883ad3168eda1c9f9e1031d9e64b2"' }>
                                    <span class="icon ion-md-arrow-round-down"></span>
                                    <span>Injectables</span>
                                    <span class="icon ion-ios-arrow-down"></span>
                                </div>
                                <ul class="links collapse"
                                    ${ isNormalMode ? 'id="injectables-links-module-BulkLoadProductModule-a45883ad3168eda1c9f9e1031d9e64b2"' : 'id="xs-injectables-links-module-BulkLoadProductModule-a45883ad3168eda1c9f9e1031d9e64b2"' }>
                                        <li class="link">
                                            <a href="injectables/BulkLoadProductService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules"}>BulkLoadProductService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/ComponentsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules"}>ComponentsService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/EventEmitterOrders.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules"}>EventEmitterOrders</a>
                                        </li>
                                </ul>
                            </li>
                    </li>
                    <li class="link">
                        <a href="modules/BulkLoadProductRoutingModule.html" data-type="entity-link">BulkLoadProductRoutingModule</a>
                    </li>
                    <li class="link">
                        <a href="modules/BulkLoadRoutingModule.html" data-type="entity-link">BulkLoadRoutingModule</a>
                    </li>
                    <li class="link">
                        <a href="modules/CitiesModule.html" data-type="entity-link">CitiesModule</a>
                            <li class="chapter inner">
                                <div class="simple menu-toggler" data-toggle="collapse"
                                    ${ isNormalMode ? 'data-target="#components-links-module-CitiesModule-cdae6f6f7ef404c7d4f24866d7eec93d"' : 'data-target="#xs-components-links-module-CitiesModule-cdae6f6f7ef404c7d4f24866d7eec93d"' }>
                                    <span class="icon ion-md-cog"></span>
                                    <span>Components</span>
                                    <span class="icon ion-ios-arrow-down"></span>
                                </div>
                                <ul class="links collapse"
                                    ${ isNormalMode ? 'id="components-links-module-CitiesModule-cdae6f6f7ef404c7d4f24866d7eec93d"' : 'id="xs-components-links-module-CitiesModule-cdae6f6f7ef404c7d4f24866d7eec93d"' }>
                                        <li class="link">
                                            <a href="components/CitiesComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">CitiesComponent</a>
                                        </li>
                                </ul>
                            </li>
                    </li>
                    <li class="link">
                        <a href="modules/ClientInformationModule.html" data-type="entity-link">ClientInformationModule</a>
                            <li class="chapter inner">
                                <div class="simple menu-toggler" data-toggle="collapse"
                                    ${ isNormalMode ? 'data-target="#components-links-module-ClientInformationModule-b4348a8e2b124b1673bb0019a8ffcb14"' : 'data-target="#xs-components-links-module-ClientInformationModule-b4348a8e2b124b1673bb0019a8ffcb14"' }>
                                    <span class="icon ion-md-cog"></span>
                                    <span>Components</span>
                                    <span class="icon ion-ios-arrow-down"></span>
                                </div>
                                <ul class="links collapse"
                                    ${ isNormalMode ? 'id="components-links-module-ClientInformationModule-b4348a8e2b124b1673bb0019a8ffcb14"' : 'id="xs-components-links-module-ClientInformationModule-b4348a8e2b124b1673bb0019a8ffcb14"' }>
                                        <li class="link">
                                            <a href="components/ClientInformationComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">ClientInformationComponent</a>
                                        </li>
                                </ul>
                            </li>
                    </li>
                    <li class="link">
                        <a href="modules/CoreModule.html" data-type="entity-link">CoreModule</a>
                            <li class="chapter inner">
                                <div class="simple menu-toggler" data-toggle="collapse"
                                    ${ isNormalMode ? 'data-target="#components-links-module-CoreModule-582762c0daab7609cb197608ce1a7989"' : 'data-target="#xs-components-links-module-CoreModule-582762c0daab7609cb197608ce1a7989"' }>
                                    <span class="icon ion-md-cog"></span>
                                    <span>Components</span>
                                    <span class="icon ion-ios-arrow-down"></span>
                                </div>
                                <ul class="links collapse"
                                    ${ isNormalMode ? 'id="components-links-module-CoreModule-582762c0daab7609cb197608ce1a7989"' : 'id="xs-components-links-module-CoreModule-582762c0daab7609cb197608ce1a7989"' }>
                                        <li class="link">
                                            <a href="components/LoadingComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">LoadingComponent</a>
                                        </li>
                                        <li class="link">
                                            <a href="components/ModalComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">ModalComponent</a>
                                        </li>
                                </ul>
                            </li>
                            <li class="chapter inner">
                                <div class="simple menu-toggler" data-toggle="collapse"
                                    ${ isNormalMode ? 'data-target="#injectables-links-module-CoreModule-582762c0daab7609cb197608ce1a7989"' : 'data-target="#xs-injectables-links-module-CoreModule-582762c0daab7609cb197608ce1a7989"' }>
                                    <span class="icon ion-md-arrow-round-down"></span>
                                    <span>Injectables</span>
                                    <span class="icon ion-ios-arrow-down"></span>
                                </div>
                                <ul class="links collapse"
                                    ${ isNormalMode ? 'id="injectables-links-module-CoreModule-582762c0daab7609cb197608ce1a7989"' : 'id="xs-injectables-links-module-CoreModule-582762c0daab7609cb197608ce1a7989"' }>
                                        <li class="link">
                                            <a href="injectables/AwsUtil.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules"}>AwsUtil</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/CognitoUtil.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules"}>CognitoUtil</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/DynamoDBService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules"}>DynamoDBService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/EndpointService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules"}>EndpointService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/HttpCacheService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules"}>HttpCacheService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/LoadingService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules"}>LoadingService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/ModalService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules"}>ModalService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/UserLoginService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules"}>UserLoginService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/UserParametersService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules"}>UserParametersService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/UserRegistrationService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules"}>UserRegistrationService</a>
                                        </li>
                                </ul>
                            </li>
                    </li>
                    <li class="link">
                        <a href="modules/CreateDialogModule.html" data-type="entity-link">CreateDialogModule</a>
                            <li class="chapter inner">
                                <div class="simple menu-toggler" data-toggle="collapse"
                                    ${ isNormalMode ? 'data-target="#components-links-module-CreateDialogModule-c031e622bab09b2a633fc8b601d9bb3d"' : 'data-target="#xs-components-links-module-CreateDialogModule-c031e622bab09b2a633fc8b601d9bb3d"' }>
                                    <span class="icon ion-md-cog"></span>
                                    <span>Components</span>
                                    <span class="icon ion-ios-arrow-down"></span>
                                </div>
                                <ul class="links collapse"
                                    ${ isNormalMode ? 'id="components-links-module-CreateDialogModule-c031e622bab09b2a633fc8b601d9bb3d"' : 'id="xs-components-links-module-CreateDialogModule-c031e622bab09b2a633fc8b601d9bb3d"' }>
                                        <li class="link">
                                            <a href="components/CreateDialogComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">CreateDialogComponent</a>
                                        </li>
                                </ul>
                            </li>
                            <li class="chapter inner">
                                <div class="simple menu-toggler" data-toggle="collapse"
                                    ${ isNormalMode ? 'data-target="#injectables-links-module-CreateDialogModule-c031e622bab09b2a633fc8b601d9bb3d"' : 'data-target="#xs-injectables-links-module-CreateDialogModule-c031e622bab09b2a633fc8b601d9bb3d"' }>
                                    <span class="icon ion-md-arrow-round-down"></span>
                                    <span>Injectables</span>
                                    <span class="icon ion-ios-arrow-down"></span>
                                </div>
                                <ul class="links collapse"
                                    ${ isNormalMode ? 'id="injectables-links-module-CreateDialogModule-c031e622bab09b2a633fc8b601d9bb3d"' : 'id="xs-injectables-links-module-CreateDialogModule-c031e622bab09b2a633fc8b601d9bb3d"' }>
                                        <li class="link">
                                            <a href="injectables/CreateDialogService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules"}>CreateDialogService</a>
                                        </li>
                                </ul>
                            </li>
                    </li>
                    <li class="link">
                        <a href="modules/DeleteDialogModule.html" data-type="entity-link">DeleteDialogModule</a>
                            <li class="chapter inner">
                                <div class="simple menu-toggler" data-toggle="collapse"
                                    ${ isNormalMode ? 'data-target="#components-links-module-DeleteDialogModule-a7d994561ed80163c599b5a86717c9c2"' : 'data-target="#xs-components-links-module-DeleteDialogModule-a7d994561ed80163c599b5a86717c9c2"' }>
                                    <span class="icon ion-md-cog"></span>
                                    <span>Components</span>
                                    <span class="icon ion-ios-arrow-down"></span>
                                </div>
                                <ul class="links collapse"
                                    ${ isNormalMode ? 'id="components-links-module-DeleteDialogModule-a7d994561ed80163c599b5a86717c9c2"' : 'id="xs-components-links-module-DeleteDialogModule-a7d994561ed80163c599b5a86717c9c2"' }>
                                        <li class="link">
                                            <a href="components/DeleteDialogComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">DeleteDialogComponent</a>
                                        </li>
                                </ul>
                            </li>
                    </li>
                    <li class="link">
                        <a href="modules/DetailModule.html" data-type="entity-link">DetailModule</a>
                            <li class="chapter inner">
                                <div class="simple menu-toggler" data-toggle="collapse"
                                    ${ isNormalMode ? 'data-target="#components-links-module-DetailModule-c916f191ab034f0195f24a625e560cc4"' : 'data-target="#xs-components-links-module-DetailModule-c916f191ab034f0195f24a625e560cc4"' }>
                                    <span class="icon ion-md-cog"></span>
                                    <span>Components</span>
                                    <span class="icon ion-ios-arrow-down"></span>
                                </div>
                                <ul class="links collapse"
                                    ${ isNormalMode ? 'id="components-links-module-DetailModule-c916f191ab034f0195f24a625e560cc4"' : 'id="xs-components-links-module-DetailModule-c916f191ab034f0195f24a625e560cc4"' }>
                                        <li class="link">
                                            <a href="components/DetailComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">DetailComponent</a>
                                        </li>
                                </ul>
                            </li>
                            <li class="chapter inner">
                                <div class="simple menu-toggler" data-toggle="collapse"
                                    ${ isNormalMode ? 'data-target="#injectables-links-module-DetailModule-c916f191ab034f0195f24a625e560cc4"' : 'data-target="#xs-injectables-links-module-DetailModule-c916f191ab034f0195f24a625e560cc4"' }>
                                    <span class="icon ion-md-arrow-round-down"></span>
                                    <span>Injectables</span>
                                    <span class="icon ion-ios-arrow-down"></span>
                                </div>
                                <ul class="links collapse"
                                    ${ isNormalMode ? 'id="injectables-links-module-DetailModule-c916f191ab034f0195f24a625e560cc4"' : 'id="xs-injectables-links-module-DetailModule-c916f191ab034f0195f24a625e560cc4"' }>
                                        <li class="link">
                                            <a href="injectables/DetailService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules"}>DetailService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/ShipmentsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules"}>ShipmentsService</a>
                                        </li>
                                </ul>
                            </li>
                    </li>
                    <li class="link">
                        <a href="modules/DetailRoutingModule.html" data-type="entity-link">DetailRoutingModule</a>
                    </li>
                    <li class="link">
                        <a href="modules/DispatchModule.html" data-type="entity-link">DispatchModule</a>
                            <li class="chapter inner">
                                <div class="simple menu-toggler" data-toggle="collapse"
                                    ${ isNormalMode ? 'data-target="#components-links-module-DispatchModule-f42b3dd0a61a0028cd6f8d826d082db8"' : 'data-target="#xs-components-links-module-DispatchModule-f42b3dd0a61a0028cd6f8d826d082db8"' }>
                                    <span class="icon ion-md-cog"></span>
                                    <span>Components</span>
                                    <span class="icon ion-ios-arrow-down"></span>
                                </div>
                                <ul class="links collapse"
                                    ${ isNormalMode ? 'id="components-links-module-DispatchModule-f42b3dd0a61a0028cd6f8d826d082db8"' : 'id="xs-components-links-module-DispatchModule-f42b3dd0a61a0028cd6f8d826d082db8"' }>
                                        <li class="link">
                                            <a href="components/DispatchedComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">DispatchedComponent</a>
                                        </li>
                                </ul>
                            </li>
                            <li class="chapter inner">
                                <div class="simple menu-toggler" data-toggle="collapse"
                                    ${ isNormalMode ? 'data-target="#injectables-links-module-DispatchModule-f42b3dd0a61a0028cd6f8d826d082db8"' : 'data-target="#xs-injectables-links-module-DispatchModule-f42b3dd0a61a0028cd6f8d826d082db8"' }>
                                    <span class="icon ion-md-arrow-round-down"></span>
                                    <span>Injectables</span>
                                    <span class="icon ion-ios-arrow-down"></span>
                                </div>
                                <ul class="links collapse"
                                    ${ isNormalMode ? 'id="injectables-links-module-DispatchModule-f42b3dd0a61a0028cd6f8d826d082db8"' : 'id="xs-injectables-links-module-DispatchModule-f42b3dd0a61a0028cd6f8d826d082db8"' }>
                                        <li class="link">
                                            <a href="injectables/ShipmentsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules"}>ShipmentsService</a>
                                        </li>
                                </ul>
                            </li>
                    </li>
                    <li class="link">
                        <a href="modules/DispatchRoutingModule.html" data-type="entity-link">DispatchRoutingModule</a>
                    </li>
                    <li class="link">
                        <a href="modules/DownloadHistoricalModalAdminModule.html" data-type="entity-link">DownloadHistoricalModalAdminModule</a>
                            <li class="chapter inner">
                                <div class="simple menu-toggler" data-toggle="collapse"
                                    ${ isNormalMode ? 'data-target="#components-links-module-DownloadHistoricalModalAdminModule-f97f72b4a88abc9ba2cc2845820aa8d1"' : 'data-target="#xs-components-links-module-DownloadHistoricalModalAdminModule-f97f72b4a88abc9ba2cc2845820aa8d1"' }>
                                    <span class="icon ion-md-cog"></span>
                                    <span>Components</span>
                                    <span class="icon ion-ios-arrow-down"></span>
                                </div>
                                <ul class="links collapse"
                                    ${ isNormalMode ? 'id="components-links-module-DownloadHistoricalModalAdminModule-f97f72b4a88abc9ba2cc2845820aa8d1"' : 'id="xs-components-links-module-DownloadHistoricalModalAdminModule-f97f72b4a88abc9ba2cc2845820aa8d1"' }>
                                        <li class="link">
                                            <a href="components/DownloadHistoricalModalComponent-1.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">DownloadHistoricalModalComponent</a>
                                        </li>
                                </ul>
                            </li>
                            <li class="chapter inner">
                                <div class="simple menu-toggler" data-toggle="collapse"
                                    ${ isNormalMode ? 'data-target="#injectables-links-module-DownloadHistoricalModalAdminModule-f97f72b4a88abc9ba2cc2845820aa8d1"' : 'data-target="#xs-injectables-links-module-DownloadHistoricalModalAdminModule-f97f72b4a88abc9ba2cc2845820aa8d1"' }>
                                    <span class="icon ion-md-arrow-round-down"></span>
                                    <span>Injectables</span>
                                    <span class="icon ion-ios-arrow-down"></span>
                                </div>
                                <ul class="links collapse"
                                    ${ isNormalMode ? 'id="injectables-links-module-DownloadHistoricalModalAdminModule-f97f72b4a88abc9ba2cc2845820aa8d1"' : 'id="xs-injectables-links-module-DownloadHistoricalModalAdminModule-f97f72b4a88abc9ba2cc2845820aa8d1"' }>
                                        <li class="link">
                                            <a href="injectables/ComponentsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules"}>ComponentsService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/DownloadHistoricalService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules"}>DownloadHistoricalService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/EndpointService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules"}>EndpointService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/UserLoginService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules"}>UserLoginService</a>
                                        </li>
                                </ul>
                            </li>
                    </li>
                    <li class="link">
                        <a href="modules/DownloadHistoricalModalModule.html" data-type="entity-link">DownloadHistoricalModalModule</a>
                            <li class="chapter inner">
                                <div class="simple menu-toggler" data-toggle="collapse"
                                    ${ isNormalMode ? 'data-target="#components-links-module-DownloadHistoricalModalModule-06a0c934ea11af61154158fa78fc47ca"' : 'data-target="#xs-components-links-module-DownloadHistoricalModalModule-06a0c934ea11af61154158fa78fc47ca"' }>
                                    <span class="icon ion-md-cog"></span>
                                    <span>Components</span>
                                    <span class="icon ion-ios-arrow-down"></span>
                                </div>
                                <ul class="links collapse"
                                    ${ isNormalMode ? 'id="components-links-module-DownloadHistoricalModalModule-06a0c934ea11af61154158fa78fc47ca"' : 'id="xs-components-links-module-DownloadHistoricalModalModule-06a0c934ea11af61154158fa78fc47ca"' }>
                                        <li class="link">
                                            <a href="components/DownloadHistoricalModalComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">DownloadHistoricalModalComponent</a>
                                        </li>
                                </ul>
                            </li>
                            <li class="chapter inner">
                                <div class="simple menu-toggler" data-toggle="collapse"
                                    ${ isNormalMode ? 'data-target="#injectables-links-module-DownloadHistoricalModalModule-06a0c934ea11af61154158fa78fc47ca"' : 'data-target="#xs-injectables-links-module-DownloadHistoricalModalModule-06a0c934ea11af61154158fa78fc47ca"' }>
                                    <span class="icon ion-md-arrow-round-down"></span>
                                    <span>Injectables</span>
                                    <span class="icon ion-ios-arrow-down"></span>
                                </div>
                                <ul class="links collapse"
                                    ${ isNormalMode ? 'id="injectables-links-module-DownloadHistoricalModalModule-06a0c934ea11af61154158fa78fc47ca"' : 'id="xs-injectables-links-module-DownloadHistoricalModalModule-06a0c934ea11af61154158fa78fc47ca"' }>
                                        <li class="link">
                                            <a href="injectables/ComponentsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules"}>ComponentsService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/DownloadHistoricalService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules"}>DownloadHistoricalService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/EndpointService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules"}>EndpointService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/UserLoginService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules"}>UserLoginService</a>
                                        </li>
                                </ul>
                            </li>
                    </li>
                    <li class="link">
                        <a href="modules/DownloadOrderModalModule.html" data-type="entity-link">DownloadOrderModalModule</a>
                            <li class="chapter inner">
                                <div class="simple menu-toggler" data-toggle="collapse"
                                    ${ isNormalMode ? 'data-target="#components-links-module-DownloadOrderModalModule-24b1a578e36bac0ef4b030370fd73cb3"' : 'data-target="#xs-components-links-module-DownloadOrderModalModule-24b1a578e36bac0ef4b030370fd73cb3"' }>
                                    <span class="icon ion-md-cog"></span>
                                    <span>Components</span>
                                    <span class="icon ion-ios-arrow-down"></span>
                                </div>
                                <ul class="links collapse"
                                    ${ isNormalMode ? 'id="components-links-module-DownloadOrderModalModule-24b1a578e36bac0ef4b030370fd73cb3"' : 'id="xs-components-links-module-DownloadOrderModalModule-24b1a578e36bac0ef4b030370fd73cb3"' }>
                                        <li class="link">
                                            <a href="components/DownloadOrderModalComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">DownloadOrderModalComponent</a>
                                        </li>
                                </ul>
                            </li>
                            <li class="chapter inner">
                                <div class="simple menu-toggler" data-toggle="collapse"
                                    ${ isNormalMode ? 'data-target="#injectables-links-module-DownloadOrderModalModule-24b1a578e36bac0ef4b030370fd73cb3"' : 'data-target="#xs-injectables-links-module-DownloadOrderModalModule-24b1a578e36bac0ef4b030370fd73cb3"' }>
                                    <span class="icon ion-md-arrow-round-down"></span>
                                    <span>Injectables</span>
                                    <span class="icon ion-ios-arrow-down"></span>
                                </div>
                                <ul class="links collapse"
                                    ${ isNormalMode ? 'id="injectables-links-module-DownloadOrderModalModule-24b1a578e36bac0ef4b030370fd73cb3"' : 'id="xs-injectables-links-module-DownloadOrderModalModule-24b1a578e36bac0ef4b030370fd73cb3"' }>
                                        <li class="link">
                                            <a href="injectables/DownloadOrderService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules"}>DownloadOrderService</a>
                                        </li>
                                </ul>
                            </li>
                    </li>
                    <li class="link">
                        <a href="modules/ErrorModule.html" data-type="entity-link">ErrorModule</a>
                            <li class="chapter inner">
                                <div class="simple menu-toggler" data-toggle="collapse"
                                    ${ isNormalMode ? 'data-target="#components-links-module-ErrorModule-b1e7d99168f3d15af708cca34b6822c8"' : 'data-target="#xs-components-links-module-ErrorModule-b1e7d99168f3d15af708cca34b6822c8"' }>
                                    <span class="icon ion-md-cog"></span>
                                    <span>Components</span>
                                    <span class="icon ion-ios-arrow-down"></span>
                                </div>
                                <ul class="links collapse"
                                    ${ isNormalMode ? 'id="components-links-module-ErrorModule-b1e7d99168f3d15af708cca34b6822c8"' : 'id="xs-components-links-module-ErrorModule-b1e7d99168f3d15af708cca34b6822c8"' }>
                                        <li class="link">
                                            <a href="components/ErrorPageComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">ErrorPageComponent</a>
                                        </li>
                                </ul>
                            </li>
                    </li>
                    <li class="link">
                        <a href="modules/HistoricModule.html" data-type="entity-link">HistoricModule</a>
                            <li class="chapter inner">
                                <div class="simple menu-toggler" data-toggle="collapse"
                                    ${ isNormalMode ? 'data-target="#components-links-module-HistoricModule-4aa04d83b36af546b90ed63dd95a595f"' : 'data-target="#xs-components-links-module-HistoricModule-4aa04d83b36af546b90ed63dd95a595f"' }>
                                    <span class="icon ion-md-cog"></span>
                                    <span>Components</span>
                                    <span class="icon ion-ios-arrow-down"></span>
                                </div>
                                <ul class="links collapse"
                                    ${ isNormalMode ? 'id="components-links-module-HistoricModule-4aa04d83b36af546b90ed63dd95a595f"' : 'id="xs-components-links-module-HistoricModule-4aa04d83b36af546b90ed63dd95a595f"' }>
                                        <li class="link">
                                            <a href="components/HistoricComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">HistoricComponent</a>
                                        </li>
                                </ul>
                            </li>
                            <li class="chapter inner">
                                <div class="simple menu-toggler" data-toggle="collapse"
                                    ${ isNormalMode ? 'data-target="#injectables-links-module-HistoricModule-4aa04d83b36af546b90ed63dd95a595f"' : 'data-target="#xs-injectables-links-module-HistoricModule-4aa04d83b36af546b90ed63dd95a595f"' }>
                                    <span class="icon ion-md-arrow-round-down"></span>
                                    <span>Injectables</span>
                                    <span class="icon ion-ios-arrow-down"></span>
                                </div>
                                <ul class="links collapse"
                                    ${ isNormalMode ? 'id="injectables-links-module-HistoricModule-4aa04d83b36af546b90ed63dd95a595f"' : 'id="xs-injectables-links-module-HistoricModule-4aa04d83b36af546b90ed63dd95a595f"' }>
                                        <li class="link">
                                            <a href="injectables/ShipmentsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules"}>ShipmentsService</a>
                                        </li>
                                </ul>
                            </li>
                    </li>
                    <li class="link">
                        <a href="modules/HistoricRoutingModule.html" data-type="entity-link">HistoricRoutingModule</a>
                    </li>
                    <li class="link">
                        <a href="modules/HistoricalModule.html" data-type="entity-link">HistoricalModule</a>
                            <li class="chapter inner">
                                <div class="simple menu-toggler" data-toggle="collapse"
                                    ${ isNormalMode ? 'data-target="#components-links-module-HistoricalModule-03a7a75dc886da4887989a97067ef29b"' : 'data-target="#xs-components-links-module-HistoricalModule-03a7a75dc886da4887989a97067ef29b"' }>
                                    <span class="icon ion-md-cog"></span>
                                    <span>Components</span>
                                    <span class="icon ion-ios-arrow-down"></span>
                                </div>
                                <ul class="links collapse"
                                    ${ isNormalMode ? 'id="components-links-module-HistoricalModule-03a7a75dc886da4887989a97067ef29b"' : 'id="xs-components-links-module-HistoricalModule-03a7a75dc886da4887989a97067ef29b"' }>
                                        <li class="link">
                                            <a href="components/FilterComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">FilterComponent</a>
                                        </li>
                                        <li class="link">
                                            <a href="components/HistoricalComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">HistoricalComponent</a>
                                        </li>
                                        <li class="link">
                                            <a href="components/ToolbarComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">ToolbarComponent</a>
                                        </li>
                                </ul>
                            </li>
                            <li class="chapter inner">
                                <div class="simple menu-toggler" data-toggle="collapse"
                                    ${ isNormalMode ? 'data-target="#injectables-links-module-HistoricalModule-03a7a75dc886da4887989a97067ef29b"' : 'data-target="#xs-injectables-links-module-HistoricalModule-03a7a75dc886da4887989a97067ef29b"' }>
                                    <span class="icon ion-md-arrow-round-down"></span>
                                    <span>Injectables</span>
                                    <span class="icon ion-ios-arrow-down"></span>
                                </div>
                                <ul class="links collapse"
                                    ${ isNormalMode ? 'id="injectables-links-module-HistoricalModule-03a7a75dc886da4887989a97067ef29b"' : 'id="xs-injectables-links-module-HistoricalModule-03a7a75dc886da4887989a97067ef29b"' }>
                                        <li class="link">
                                            <a href="injectables/HistoricalService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules"}>HistoricalService</a>
                                        </li>
                                </ul>
                            </li>
                    </li>
                    <li class="link">
                        <a href="modules/HistoricalModuleAdmin.html" data-type="entity-link">HistoricalModuleAdmin</a>
                            <li class="chapter inner">
                                <div class="simple menu-toggler" data-toggle="collapse"
                                    ${ isNormalMode ? 'data-target="#components-links-module-HistoricalModuleAdmin-c99d259308e13acff59927385c777187"' : 'data-target="#xs-components-links-module-HistoricalModuleAdmin-c99d259308e13acff59927385c777187"' }>
                                    <span class="icon ion-md-cog"></span>
                                    <span>Components</span>
                                    <span class="icon ion-ios-arrow-down"></span>
                                </div>
                                <ul class="links collapse"
                                    ${ isNormalMode ? 'id="components-links-module-HistoricalModuleAdmin-c99d259308e13acff59927385c777187"' : 'id="xs-components-links-module-HistoricalModuleAdmin-c99d259308e13acff59927385c777187"' }>
                                        <li class="link">
                                            <a href="components/HistoricalAdminComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">HistoricalAdminComponent</a>
                                        </li>
                                </ul>
                            </li>
                            <li class="chapter inner">
                                <div class="simple menu-toggler" data-toggle="collapse"
                                    ${ isNormalMode ? 'data-target="#injectables-links-module-HistoricalModuleAdmin-c99d259308e13acff59927385c777187"' : 'data-target="#xs-injectables-links-module-HistoricalModuleAdmin-c99d259308e13acff59927385c777187"' }>
                                    <span class="icon ion-md-arrow-round-down"></span>
                                    <span>Injectables</span>
                                    <span class="icon ion-ios-arrow-down"></span>
                                </div>
                                <ul class="links collapse"
                                    ${ isNormalMode ? 'id="injectables-links-module-HistoricalModuleAdmin-c99d259308e13acff59927385c777187"' : 'id="xs-injectables-links-module-HistoricalModuleAdmin-c99d259308e13acff59927385c777187"' }>
                                        <li class="link">
                                            <a href="injectables/HistoricalService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules"}>HistoricalService</a>
                                        </li>
                                </ul>
                            </li>
                    </li>
                    <li class="link">
                        <a href="modules/HistoricalRoutingModule.html" data-type="entity-link">HistoricalRoutingModule</a>
                    </li>
                    <li class="link">
                        <a href="modules/HistoricalRoutingModule.html" data-type="entity-link">HistoricalRoutingModule</a>
                    </li>
                    <li class="link">
                        <a href="modules/HomeModule.html" data-type="entity-link">HomeModule</a>
                            <li class="chapter inner">
                                <div class="simple menu-toggler" data-toggle="collapse"
                                    ${ isNormalMode ? 'data-target="#components-links-module-HomeModule-8e4302ad1b32cf56d43824e059e6ad18"' : 'data-target="#xs-components-links-module-HomeModule-8e4302ad1b32cf56d43824e059e6ad18"' }>
                                    <span class="icon ion-md-cog"></span>
                                    <span>Components</span>
                                    <span class="icon ion-ios-arrow-down"></span>
                                </div>
                                <ul class="links collapse"
                                    ${ isNormalMode ? 'id="components-links-module-HomeModule-8e4302ad1b32cf56d43824e059e6ad18"' : 'id="xs-components-links-module-HomeModule-8e4302ad1b32cf56d43824e059e6ad18"' }>
                                        <li class="link">
                                            <a href="components/AboutComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">AboutComponent</a>
                                        </li>
                                        <li class="link">
                                            <a href="components/ForgotPassword2Component.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">ForgotPassword2Component</a>
                                        </li>
                                        <li class="link">
                                            <a href="components/ForgotPasswordStep1Component.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">ForgotPasswordStep1Component</a>
                                        </li>
                                        <li class="link">
                                            <a href="components/HomeComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">HomeComponent</a>
                                        </li>
                                        <li class="link">
                                            <a href="components/HomeLandingComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">HomeLandingComponent</a>
                                        </li>
                                        <li class="link">
                                            <a href="components/LoginComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">LoginComponent</a>
                                        </li>
                                        <li class="link">
                                            <a href="components/LogoutComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">LogoutComponent</a>
                                        </li>
                                        <li class="link">
                                            <a href="components/MFAComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">MFAComponent</a>
                                        </li>
                                        <li class="link">
                                            <a href="components/NewPasswordComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">NewPasswordComponent</a>
                                        </li>
                                        <li class="link">
                                            <a href="components/RegisterComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">RegisterComponent</a>
                                        </li>
                                        <li class="link">
                                            <a href="components/RegistrationConfirmationComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">RegistrationConfirmationComponent</a>
                                        </li>
                                        <li class="link">
                                            <a href="components/ResendCodeComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">ResendCodeComponent</a>
                                        </li>
                                </ul>
                            </li>
                    </li>
                    <li class="link">
                        <a href="modules/HomeRoutingModule.html" data-type="entity-link">HomeRoutingModule</a>
                    </li>
                    <li class="link">
                        <a href="modules/InDevolutionModule.html" data-type="entity-link">InDevolutionModule</a>
                            <li class="chapter inner">
                                <div class="simple menu-toggler" data-toggle="collapse"
                                    ${ isNormalMode ? 'data-target="#components-links-module-InDevolutionModule-8f7a3a5fe3af6ebfeb368d5fa4154924"' : 'data-target="#xs-components-links-module-InDevolutionModule-8f7a3a5fe3af6ebfeb368d5fa4154924"' }>
                                    <span class="icon ion-md-cog"></span>
                                    <span>Components</span>
                                    <span class="icon ion-ios-arrow-down"></span>
                                </div>
                                <ul class="links collapse"
                                    ${ isNormalMode ? 'id="components-links-module-InDevolutionModule-8f7a3a5fe3af6ebfeb368d5fa4154924"' : 'id="xs-components-links-module-InDevolutionModule-8f7a3a5fe3af6ebfeb368d5fa4154924"' }>
                                        <li class="link">
                                            <a href="components/ActionConfirmReceiptComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">ActionConfirmReceiptComponent</a>
                                        </li>
                                        <li class="link">
                                            <a href="components/ActionReportNoveltyComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">ActionReportNoveltyComponent</a>
                                        </li>
                                        <li class="link">
                                            <a href="components/InDevolutionComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">InDevolutionComponent</a>
                                        </li>
                                        <li class="link">
                                            <a href="components/ProductDevolutionModalComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">ProductDevolutionModalComponent</a>
                                        </li>
                                        <li class="link">
                                            <a href="components/ViewCommentComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">ViewCommentComponent</a>
                                        </li>
                                </ul>
                            </li>
                    </li>
                    <li class="link">
                        <a href="modules/InValidationModule.html" data-type="entity-link">InValidationModule</a>
                            <li class="chapter inner">
                                <div class="simple menu-toggler" data-toggle="collapse"
                                    ${ isNormalMode ? 'data-target="#components-links-module-InValidationModule-a6acc8ac2dccd3d35d5bd59bffd86d33"' : 'data-target="#xs-components-links-module-InValidationModule-a6acc8ac2dccd3d35d5bd59bffd86d33"' }>
                                    <span class="icon ion-md-cog"></span>
                                    <span>Components</span>
                                    <span class="icon ion-ios-arrow-down"></span>
                                </div>
                                <ul class="links collapse"
                                    ${ isNormalMode ? 'id="components-links-module-InValidationModule-a6acc8ac2dccd3d35d5bd59bffd86d33"' : 'id="xs-components-links-module-InValidationModule-a6acc8ac2dccd3d35d5bd59bffd86d33"' }>
                                        <li class="link">
                                            <a href="components/InValidationComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">InValidationComponent</a>
                                        </li>
                                        <li class="link">
                                            <a href="components/InValidationModalComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">InValidationModalComponent</a>
                                        </li>
                                </ul>
                            </li>
                    </li>
                    <li class="link">
                        <a href="modules/InValidationRoutingModule.html" data-type="entity-link">InValidationRoutingModule</a>
                    </li>
                    <li class="link">
                        <a href="modules/ListModule.html" data-type="entity-link">ListModule</a>
                            <li class="chapter inner">
                                <div class="simple menu-toggler" data-toggle="collapse"
                                    ${ isNormalMode ? 'data-target="#components-links-module-ListModule-0b49499c48c8d283a5aa4817cb8882f1"' : 'data-target="#xs-components-links-module-ListModule-0b49499c48c8d283a5aa4817cb8882f1"' }>
                                    <span class="icon ion-md-cog"></span>
                                    <span>Components</span>
                                    <span class="icon ion-ios-arrow-down"></span>
                                </div>
                                <ul class="links collapse"
                                    ${ isNormalMode ? 'id="components-links-module-ListModule-0b49499c48c8d283a5aa4817cb8882f1"' : 'id="xs-components-links-module-ListModule-0b49499c48c8d283a5aa4817cb8882f1"' }>
                                        <li class="link">
                                            <a href="components/DetailOfferComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">DetailOfferComponent</a>
                                        </li>
                                        <li class="link">
                                            <a href="components/ListComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">ListComponent</a>
                                        </li>
                                </ul>
                            </li>
                            <li class="chapter inner">
                                <div class="simple menu-toggler" data-toggle="collapse"
                                    ${ isNormalMode ? 'data-target="#injectables-links-module-ListModule-0b49499c48c8d283a5aa4817cb8882f1"' : 'data-target="#xs-injectables-links-module-ListModule-0b49499c48c8d283a5aa4817cb8882f1"' }>
                                    <span class="icon ion-md-arrow-round-down"></span>
                                    <span>Injectables</span>
                                    <span class="icon ion-ios-arrow-down"></span>
                                </div>
                                <ul class="links collapse"
                                    ${ isNormalMode ? 'id="injectables-links-module-ListModule-0b49499c48c8d283a5aa4817cb8882f1"' : 'id="xs-injectables-links-module-ListModule-0b49499c48c8d283a5aa4817cb8882f1"' }>
                                        <li class="link">
                                            <a href="injectables/ListService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules"}>ListService</a>
                                        </li>
                                </ul>
                            </li>
                    </li>
                    <li class="link">
                        <a href="modules/ListRoutingModule.html" data-type="entity-link">ListRoutingModule</a>
                    </li>
                    <li class="link">
                        <a href="modules/ListTransporterModule.html" data-type="entity-link">ListTransporterModule</a>
                            <li class="chapter inner">
                                <div class="simple menu-toggler" data-toggle="collapse"
                                    ${ isNormalMode ? 'data-target="#components-links-module-ListTransporterModule-246a8566e973e0e4c67250715a58470f"' : 'data-target="#xs-components-links-module-ListTransporterModule-246a8566e973e0e4c67250715a58470f"' }>
                                    <span class="icon ion-md-cog"></span>
                                    <span>Components</span>
                                    <span class="icon ion-ios-arrow-down"></span>
                                </div>
                                <ul class="links collapse"
                                    ${ isNormalMode ? 'id="components-links-module-ListTransporterModule-246a8566e973e0e4c67250715a58470f"' : 'id="xs-components-links-module-ListTransporterModule-246a8566e973e0e4c67250715a58470f"' }>
                                        <li class="link">
                                            <a href="components/ListTransporterComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">ListTransporterComponent</a>
                                        </li>
                                </ul>
                            </li>
                            <li class="chapter inner">
                                <div class="simple menu-toggler" data-toggle="collapse"
                                    ${ isNormalMode ? 'data-target="#injectables-links-module-ListTransporterModule-246a8566e973e0e4c67250715a58470f"' : 'data-target="#xs-injectables-links-module-ListTransporterModule-246a8566e973e0e4c67250715a58470f"' }>
                                    <span class="icon ion-md-arrow-round-down"></span>
                                    <span>Injectables</span>
                                    <span class="icon ion-ios-arrow-down"></span>
                                </div>
                                <ul class="links collapse"
                                    ${ isNormalMode ? 'id="injectables-links-module-ListTransporterModule-246a8566e973e0e4c67250715a58470f"' : 'id="xs-injectables-links-module-ListTransporterModule-246a8566e973e0e4c67250715a58470f"' }>
                                        <li class="link">
                                            <a href="injectables/ListTransporterService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules"}>ListTransporterService</a>
                                        </li>
                                </ul>
                            </li>
                    </li>
                    <li class="link">
                        <a href="modules/ListZonesModule.html" data-type="entity-link">ListZonesModule</a>
                            <li class="chapter inner">
                                <div class="simple menu-toggler" data-toggle="collapse"
                                    ${ isNormalMode ? 'data-target="#components-links-module-ListZonesModule-12e52c546ac0759fe84de22a3a780dd3"' : 'data-target="#xs-components-links-module-ListZonesModule-12e52c546ac0759fe84de22a3a780dd3"' }>
                                    <span class="icon ion-md-cog"></span>
                                    <span>Components</span>
                                    <span class="icon ion-ios-arrow-down"></span>
                                </div>
                                <ul class="links collapse"
                                    ${ isNormalMode ? 'id="components-links-module-ListZonesModule-12e52c546ac0759fe84de22a3a780dd3"' : 'id="xs-components-links-module-ListZonesModule-12e52c546ac0759fe84de22a3a780dd3"' }>
                                        <li class="link">
                                            <a href="components/ListZonesComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">ListZonesComponent</a>
                                        </li>
                                </ul>
                            </li>
                            <li class="chapter inner">
                                <div class="simple menu-toggler" data-toggle="collapse"
                                    ${ isNormalMode ? 'data-target="#injectables-links-module-ListZonesModule-12e52c546ac0759fe84de22a3a780dd3"' : 'data-target="#xs-injectables-links-module-ListZonesModule-12e52c546ac0759fe84de22a3a780dd3"' }>
                                    <span class="icon ion-md-arrow-round-down"></span>
                                    <span>Injectables</span>
                                    <span class="icon ion-ios-arrow-down"></span>
                                </div>
                                <ul class="links collapse"
                                    ${ isNormalMode ? 'id="injectables-links-module-ListZonesModule-12e52c546ac0759fe84de22a3a780dd3"' : 'id="xs-injectables-links-module-ListZonesModule-12e52c546ac0759fe84de22a3a780dd3"' }>
                                        <li class="link">
                                            <a href="injectables/ListZonesService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules"}>ListZonesService</a>
                                        </li>
                                </ul>
                            </li>
                    </li>
                    <li class="link">
                        <a href="modules/LoadGuideModule.html" data-type="entity-link">LoadGuideModule</a>
                            <li class="chapter inner">
                                <div class="simple menu-toggler" data-toggle="collapse"
                                    ${ isNormalMode ? 'data-target="#components-links-module-LoadGuideModule-f63a8a8bd37bd0bb666563fc4bd4d981"' : 'data-target="#xs-components-links-module-LoadGuideModule-f63a8a8bd37bd0bb666563fc4bd4d981"' }>
                                    <span class="icon ion-md-cog"></span>
                                    <span>Components</span>
                                    <span class="icon ion-ios-arrow-down"></span>
                                </div>
                                <ul class="links collapse"
                                    ${ isNormalMode ? 'id="components-links-module-LoadGuideModule-f63a8a8bd37bd0bb666563fc4bd4d981"' : 'id="xs-components-links-module-LoadGuideModule-f63a8a8bd37bd0bb666563fc4bd4d981"' }>
                                        <li class="link">
                                            <a href="components/DownloadFormatComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">DownloadFormatComponent</a>
                                        </li>
                                        <li class="link">
                                            <a href="components/FinishUploadInformationComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">FinishUploadInformationComponent</a>
                                        </li>
                                        <li class="link">
                                            <a href="components/LoadGuidePageComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">LoadGuidePageComponent</a>
                                        </li>
                                        <li class="link">
                                            <a href="components/TableErrorsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">TableErrorsComponent</a>
                                        </li>
                                        <li class="link">
                                            <a href="components/TableLoadComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">TableLoadComponent</a>
                                        </li>
                                </ul>
                            </li>
                            <li class="chapter inner">
                                <div class="simple menu-toggler" data-toggle="collapse"
                                    ${ isNormalMode ? 'data-target="#injectables-links-module-LoadGuideModule-f63a8a8bd37bd0bb666563fc4bd4d981"' : 'data-target="#xs-injectables-links-module-LoadGuideModule-f63a8a8bd37bd0bb666563fc4bd4d981"' }>
                                    <span class="icon ion-md-arrow-round-down"></span>
                                    <span>Injectables</span>
                                    <span class="icon ion-ios-arrow-down"></span>
                                </div>
                                <ul class="links collapse"
                                    ${ isNormalMode ? 'id="injectables-links-module-LoadGuideModule-f63a8a8bd37bd0bb666563fc4bd4d981"' : 'id="xs-injectables-links-module-LoadGuideModule-f63a8a8bd37bd0bb666563fc4bd4d981"' }>
                                        <li class="link">
                                            <a href="injectables/ComponentsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules"}>ComponentsService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/EventEmitterOrders.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules"}>EventEmitterOrders</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/LoadGuideService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules"}>LoadGuideService</a>
                                        </li>
                                </ul>
                            </li>
                    </li>
                    <li class="link">
                        <a href="modules/LoadGuideRoutingModule.html" data-type="entity-link">LoadGuideRoutingModule</a>
                    </li>
                    <li class="link">
                        <a href="modules/ManageModule.html" data-type="entity-link">ManageModule</a>
                            <li class="chapter inner">
                                <div class="simple menu-toggler" data-toggle="collapse"
                                    ${ isNormalMode ? 'data-target="#components-links-module-ManageModule-c672a8756a49688f935a54a94b58ba8f"' : 'data-target="#xs-components-links-module-ManageModule-c672a8756a49688f935a54a94b58ba8f"' }>
                                    <span class="icon ion-md-cog"></span>
                                    <span>Components</span>
                                    <span class="icon ion-ios-arrow-down"></span>
                                </div>
                                <ul class="links collapse"
                                    ${ isNormalMode ? 'id="components-links-module-ManageModule-c672a8756a49688f935a54a94b58ba8f"' : 'id="xs-components-links-module-ManageModule-c672a8756a49688f935a54a94b58ba8f"' }>
                                        <li class="link">
                                            <a href="components/ManageComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">ManageComponent</a>
                                        </li>
                                        <li class="link">
                                            <a href="components/ManageSellerComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">ManageSellerComponent</a>
                                        </li>
                                        <li class="link">
                                            <a href="components/ToolbarSellerComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">ToolbarSellerComponent</a>
                                        </li>
                                </ul>
                            </li>
                            <li class="chapter inner">
                                <div class="simple menu-toggler" data-toggle="collapse"
                                    ${ isNormalMode ? 'data-target="#injectables-links-module-ManageModule-c672a8756a49688f935a54a94b58ba8f"' : 'data-target="#xs-injectables-links-module-ManageModule-c672a8756a49688f935a54a94b58ba8f"' }>
                                    <span class="icon ion-md-arrow-round-down"></span>
                                    <span>Injectables</span>
                                    <span class="icon ion-ios-arrow-down"></span>
                                </div>
                                <ul class="links collapse"
                                    ${ isNormalMode ? 'id="injectables-links-module-ManageModule-c672a8756a49688f935a54a94b58ba8f"' : 'id="xs-injectables-links-module-ManageModule-c672a8756a49688f935a54a94b58ba8f"' }>
                                        <li class="link">
                                            <a href="injectables/ManageSellerService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules"}>ManageSellerService</a>
                                        </li>
                                </ul>
                            </li>
                    </li>
                    <li class="link">
                        <a href="modules/ManageRoutingModule.html" data-type="entity-link">ManageRoutingModule</a>
                    </li>
                    <li class="link">
                        <a href="modules/MaterialModule.html" data-type="entity-link">MaterialModule</a>
                    </li>
                    <li class="link">
                        <a href="modules/OrdersModule.html" data-type="entity-link">OrdersModule</a>
                            <li class="chapter inner">
                                <div class="simple menu-toggler" data-toggle="collapse"
                                    ${ isNormalMode ? 'data-target="#components-links-module-OrdersModule-60880cbe2fcc9e69bfbc00263229b923"' : 'data-target="#xs-components-links-module-OrdersModule-60880cbe2fcc9e69bfbc00263229b923"' }>
                                    <span class="icon ion-md-cog"></span>
                                    <span>Components</span>
                                    <span class="icon ion-ios-arrow-down"></span>
                                </div>
                                <ul class="links collapse"
                                    ${ isNormalMode ? 'id="components-links-module-OrdersModule-60880cbe2fcc9e69bfbc00263229b923"' : 'id="xs-components-links-module-OrdersModule-60880cbe2fcc9e69bfbc00263229b923"' }>
                                        <li class="link">
                                            <a href="components/ConfirmAlertComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">ConfirmAlertComponent</a>
                                        </li>
                                        <li class="link">
                                            <a href="components/FormProductComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">FormProductComponent</a>
                                        </li>
                                        <li class="link">
                                            <a href="components/OrderDetailModalComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">OrderDetailModalComponent</a>
                                        </li>
                                        <li class="link">
                                            <a href="components/OrdersListComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">OrdersListComponent</a>
                                        </li>
                                        <li class="link">
                                            <a href="components/ProductDetailModalComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">ProductDetailModalComponent</a>
                                        </li>
                                        <li class="link">
                                            <a href="components/ProductsOrderComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">ProductsOrderComponent</a>
                                        </li>
                                        <li class="link">
                                            <a href="components/SendOrderComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">SendOrderComponent</a>
                                        </li>
                                </ul>
                            </li>
                            <li class="chapter inner">
                                <div class="simple menu-toggler" data-toggle="collapse"
                                    ${ isNormalMode ? 'data-target="#injectables-links-module-OrdersModule-60880cbe2fcc9e69bfbc00263229b923"' : 'data-target="#xs-injectables-links-module-OrdersModule-60880cbe2fcc9e69bfbc00263229b923"' }>
                                    <span class="icon ion-md-arrow-round-down"></span>
                                    <span>Injectables</span>
                                    <span class="icon ion-ios-arrow-down"></span>
                                </div>
                                <ul class="links collapse"
                                    ${ isNormalMode ? 'id="injectables-links-module-OrdersModule-60880cbe2fcc9e69bfbc00263229b923"' : 'id="xs-injectables-links-module-OrdersModule-60880cbe2fcc9e69bfbc00263229b923"' }>
                                        <li class="link">
                                            <a href="injectables/ComponentsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules"}>ComponentsService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/EventEmitterOrders.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules"}>EventEmitterOrders</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/OrderService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules"}>OrderService</a>
                                        </li>
                                </ul>
                            </li>
                    </li>
                    <li class="link">
                        <a href="modules/OrdersRoutingModule.html" data-type="entity-link">OrdersRoutingModule</a>
                    </li>
                    <li class="link">
                        <a href="modules/PendingDevolutionModule.html" data-type="entity-link">PendingDevolutionModule</a>
                            <li class="chapter inner">
                                <div class="simple menu-toggler" data-toggle="collapse"
                                    ${ isNormalMode ? 'data-target="#components-links-module-PendingDevolutionModule-a8d97112dcd133c8ef33fdc5ad9cbfa2"' : 'data-target="#xs-components-links-module-PendingDevolutionModule-a8d97112dcd133c8ef33fdc5ad9cbfa2"' }>
                                    <span class="icon ion-md-cog"></span>
                                    <span>Components</span>
                                    <span class="icon ion-ios-arrow-down"></span>
                                </div>
                                <ul class="links collapse"
                                    ${ isNormalMode ? 'id="components-links-module-PendingDevolutionModule-a8d97112dcd133c8ef33fdc5ad9cbfa2"' : 'id="xs-components-links-module-PendingDevolutionModule-a8d97112dcd133c8ef33fdc5ad9cbfa2"' }>
                                        <li class="link">
                                            <a href="components/ActionAcceptDevolutionComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">ActionAcceptDevolutionComponent</a>
                                        </li>
                                        <li class="link">
                                            <a href="components/ActionRefuseDevolutionComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">ActionRefuseDevolutionComponent</a>
                                        </li>
                                        <li class="link">
                                            <a href="components/PendingDevolutionComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">PendingDevolutionComponent</a>
                                        </li>
                                        <li class="link">
                                            <a href="components/ProductPendingDevolutionModalComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">ProductPendingDevolutionModalComponent</a>
                                        </li>
                                </ul>
                            </li>
                            <li class="chapter inner">
                                <div class="simple menu-toggler" data-toggle="collapse"
                                    ${ isNormalMode ? 'data-target="#injectables-links-module-PendingDevolutionModule-a8d97112dcd133c8ef33fdc5ad9cbfa2"' : 'data-target="#xs-injectables-links-module-PendingDevolutionModule-a8d97112dcd133c8ef33fdc5ad9cbfa2"' }>
                                    <span class="icon ion-md-arrow-round-down"></span>
                                    <span>Injectables</span>
                                    <span class="icon ion-ios-arrow-down"></span>
                                </div>
                                <ul class="links collapse"
                                    ${ isNormalMode ? 'id="injectables-links-module-PendingDevolutionModule-a8d97112dcd133c8ef33fdc5ad9cbfa2"' : 'id="xs-injectables-links-module-PendingDevolutionModule-a8d97112dcd133c8ef33fdc5ad9cbfa2"' }>
                                        <li class="link">
                                            <a href="injectables/ComponentsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules"}>ComponentsService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/EventEmitterOrders.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules"}>EventEmitterOrders</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/PendingDevolutionService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules"}>PendingDevolutionService</a>
                                        </li>
                                </ul>
                            </li>
                    </li>
                    <li class="link">
                        <a href="modules/PendingDevolutionRoutingModule.html" data-type="entity-link">PendingDevolutionRoutingModule</a>
                    </li>
                    <li class="link">
                        <a href="modules/PendingModule.html" data-type="entity-link">PendingModule</a>
                            <li class="chapter inner">
                                <div class="simple menu-toggler" data-toggle="collapse"
                                    ${ isNormalMode ? 'data-target="#components-links-module-PendingModule-b0ec04a2623919395279cf3fee6e880d"' : 'data-target="#xs-components-links-module-PendingModule-b0ec04a2623919395279cf3fee6e880d"' }>
                                    <span class="icon ion-md-cog"></span>
                                    <span>Components</span>
                                    <span class="icon ion-ios-arrow-down"></span>
                                </div>
                                <ul class="links collapse"
                                    ${ isNormalMode ? 'id="components-links-module-PendingModule-b0ec04a2623919395279cf3fee6e880d"' : 'id="xs-components-links-module-PendingModule-b0ec04a2623919395279cf3fee6e880d"' }>
                                        <li class="link">
                                            <a href="components/PendingComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">PendingComponent</a>
                                        </li>
                                </ul>
                            </li>
                            <li class="chapter inner">
                                <div class="simple menu-toggler" data-toggle="collapse"
                                    ${ isNormalMode ? 'data-target="#injectables-links-module-PendingModule-b0ec04a2623919395279cf3fee6e880d"' : 'data-target="#xs-injectables-links-module-PendingModule-b0ec04a2623919395279cf3fee6e880d"' }>
                                    <span class="icon ion-md-arrow-round-down"></span>
                                    <span>Injectables</span>
                                    <span class="icon ion-ios-arrow-down"></span>
                                </div>
                                <ul class="links collapse"
                                    ${ isNormalMode ? 'id="injectables-links-module-PendingModule-b0ec04a2623919395279cf3fee6e880d"' : 'id="xs-injectables-links-module-PendingModule-b0ec04a2623919395279cf3fee6e880d"' }>
                                        <li class="link">
                                            <a href="injectables/PendingService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules"}>PendingService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/ShipmentsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules"}>ShipmentsService</a>
                                        </li>
                                </ul>
                            </li>
                    </li>
                    <li class="link">
                        <a href="modules/PendingRoutinModule.html" data-type="entity-link">PendingRoutinModule</a>
                    </li>
                    <li class="link">
                        <a href="modules/QuotingAdministratorModule.html" data-type="entity-link">QuotingAdministratorModule</a>
                            <li class="chapter inner">
                                <div class="simple menu-toggler" data-toggle="collapse"
                                    ${ isNormalMode ? 'data-target="#components-links-module-QuotingAdministratorModule-bc5d41d560845a6e916821a45ba0cafe"' : 'data-target="#xs-components-links-module-QuotingAdministratorModule-bc5d41d560845a6e916821a45ba0cafe"' }>
                                    <span class="icon ion-md-cog"></span>
                                    <span>Components</span>
                                    <span class="icon ion-ios-arrow-down"></span>
                                </div>
                                <ul class="links collapse"
                                    ${ isNormalMode ? 'id="components-links-module-QuotingAdministratorModule-bc5d41d560845a6e916821a45ba0cafe"' : 'id="xs-components-links-module-QuotingAdministratorModule-bc5d41d560845a6e916821a45ba0cafe"' }>
                                        <li class="link">
                                            <a href="components/QuotingAdministratorComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">QuotingAdministratorComponent</a>
                                        </li>
                                </ul>
                            </li>
                            <li class="chapter inner">
                                <div class="simple menu-toggler" data-toggle="collapse"
                                    ${ isNormalMode ? 'data-target="#injectables-links-module-QuotingAdministratorModule-bc5d41d560845a6e916821a45ba0cafe"' : 'data-target="#xs-injectables-links-module-QuotingAdministratorModule-bc5d41d560845a6e916821a45ba0cafe"' }>
                                    <span class="icon ion-md-arrow-round-down"></span>
                                    <span>Injectables</span>
                                    <span class="icon ion-ios-arrow-down"></span>
                                </div>
                                <ul class="links collapse"
                                    ${ isNormalMode ? 'id="injectables-links-module-QuotingAdministratorModule-bc5d41d560845a6e916821a45ba0cafe"' : 'id="xs-injectables-links-module-QuotingAdministratorModule-bc5d41d560845a6e916821a45ba0cafe"' }>
                                        <li class="link">
                                            <a href="injectables/EventEmitterDialogs.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules"}>EventEmitterDialogs</a>
                                        </li>
                                </ul>
                            </li>
                    </li>
                    <li class="link">
                        <a href="modules/QuotingModule.html" data-type="entity-link">QuotingModule</a>
                            <li class="chapter inner">
                                <div class="simple menu-toggler" data-toggle="collapse"
                                    ${ isNormalMode ? 'data-target="#components-links-module-QuotingModule-21a29b7d76aedeb7f2f453763100d7ff"' : 'data-target="#xs-components-links-module-QuotingModule-21a29b7d76aedeb7f2f453763100d7ff"' }>
                                    <span class="icon ion-md-cog"></span>
                                    <span>Components</span>
                                    <span class="icon ion-ios-arrow-down"></span>
                                </div>
                                <ul class="links collapse"
                                    ${ isNormalMode ? 'id="components-links-module-QuotingModule-21a29b7d76aedeb7f2f453763100d7ff"' : 'id="xs-components-links-module-QuotingModule-21a29b7d76aedeb7f2f453763100d7ff"' }>
                                        <li class="link">
                                            <a href="components/QuotingComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">QuotingComponent</a>
                                        </li>
                                </ul>
                            </li>
                    </li>
                    <li class="link">
                        <a href="modules/QuotingRoutingModule.html" data-type="entity-link">QuotingRoutingModule</a>
                    </li>
                    <li class="link">
                        <a href="modules/QuotingSellerModule.html" data-type="entity-link">QuotingSellerModule</a>
                            <li class="chapter inner">
                                <div class="simple menu-toggler" data-toggle="collapse"
                                    ${ isNormalMode ? 'data-target="#components-links-module-QuotingSellerModule-1e5b873c96a18f271d1715531e7751d2"' : 'data-target="#xs-components-links-module-QuotingSellerModule-1e5b873c96a18f271d1715531e7751d2"' }>
                                    <span class="icon ion-md-cog"></span>
                                    <span>Components</span>
                                    <span class="icon ion-ios-arrow-down"></span>
                                </div>
                                <ul class="links collapse"
                                    ${ isNormalMode ? 'id="components-links-module-QuotingSellerModule-1e5b873c96a18f271d1715531e7751d2"' : 'id="xs-components-links-module-QuotingSellerModule-1e5b873c96a18f271d1715531e7751d2"' }>
                                        <li class="link">
                                            <a href="components/QuotingSellerComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">QuotingSellerComponent</a>
                                        </li>
                                </ul>
                            </li>
                    </li>
                    <li class="link">
                        <a href="modules/RegisterModule.html" data-type="entity-link">RegisterModule</a>
                            <li class="chapter inner">
                                <div class="simple menu-toggler" data-toggle="collapse"
                                    ${ isNormalMode ? 'data-target="#components-links-module-RegisterModule-7d140e7a14c5448bb0e6d7d0e4c8fcea"' : 'data-target="#xs-components-links-module-RegisterModule-7d140e7a14c5448bb0e6d7d0e4c8fcea"' }>
                                    <span class="icon ion-md-cog"></span>
                                    <span>Components</span>
                                    <span class="icon ion-ios-arrow-down"></span>
                                </div>
                                <ul class="links collapse"
                                    ${ isNormalMode ? 'id="components-links-module-RegisterModule-7d140e7a14c5448bb0e6d7d0e4c8fcea"' : 'id="xs-components-links-module-RegisterModule-7d140e7a14c5448bb0e6d7d0e4c8fcea"' }>
                                        <li class="link">
                                            <a href="components/RegisterSellerComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">RegisterSellerComponent</a>
                                        </li>
                                </ul>
                            </li>
                            <li class="chapter inner">
                                <div class="simple menu-toggler" data-toggle="collapse"
                                    ${ isNormalMode ? 'data-target="#injectables-links-module-RegisterModule-7d140e7a14c5448bb0e6d7d0e4c8fcea"' : 'data-target="#xs-injectables-links-module-RegisterModule-7d140e7a14c5448bb0e6d7d0e4c8fcea"' }>
                                    <span class="icon ion-md-arrow-round-down"></span>
                                    <span>Injectables</span>
                                    <span class="icon ion-ios-arrow-down"></span>
                                </div>
                                <ul class="links collapse"
                                    ${ isNormalMode ? 'id="injectables-links-module-RegisterModule-7d140e7a14c5448bb0e6d7d0e4c8fcea"' : 'id="xs-injectables-links-module-RegisterModule-7d140e7a14c5448bb0e6d7d0e4c8fcea"' }>
                                        <li class="link">
                                            <a href="injectables/RegisterService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules"}>RegisterService</a>
                                        </li>
                                </ul>
                            </li>
                    </li>
                    <li class="link">
                        <a href="modules/RegisterRoutingModule.html" data-type="entity-link">RegisterRoutingModule</a>
                    </li>
                    <li class="link">
                        <a href="modules/ReportRoutingModule.html" data-type="entity-link">ReportRoutingModule</a>
                    </li>
                    <li class="link">
                        <a href="modules/ReportsModule.html" data-type="entity-link">ReportsModule</a>
                            <li class="chapter inner">
                                <div class="simple menu-toggler" data-toggle="collapse"
                                    ${ isNormalMode ? 'data-target="#components-links-module-ReportsModule-6d1b975248253740e0b7a226bf195a73"' : 'data-target="#xs-components-links-module-ReportsModule-6d1b975248253740e0b7a226bf195a73"' }>
                                    <span class="icon ion-md-cog"></span>
                                    <span>Components</span>
                                    <span class="icon ion-ios-arrow-down"></span>
                                </div>
                                <ul class="links collapse"
                                    ${ isNormalMode ? 'id="components-links-module-ReportsModule-6d1b975248253740e0b7a226bf195a73"' : 'id="xs-components-links-module-ReportsModule-6d1b975248253740e0b7a226bf195a73"' }>
                                        <li class="link">
                                            <a href="components/ReportsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">ReportsComponent</a>
                                        </li>
                                </ul>
                            </li>
                            <li class="chapter inner">
                                <div class="simple menu-toggler" data-toggle="collapse"
                                    ${ isNormalMode ? 'data-target="#injectables-links-module-ReportsModule-6d1b975248253740e0b7a226bf195a73"' : 'data-target="#xs-injectables-links-module-ReportsModule-6d1b975248253740e0b7a226bf195a73"' }>
                                    <span class="icon ion-md-arrow-round-down"></span>
                                    <span>Injectables</span>
                                    <span class="icon ion-ios-arrow-down"></span>
                                </div>
                                <ul class="links collapse"
                                    ${ isNormalMode ? 'id="injectables-links-module-ReportsModule-6d1b975248253740e0b7a226bf195a73"' : 'id="xs-injectables-links-module-ReportsModule-6d1b975248253740e0b7a226bf195a73"' }>
                                        <li class="link">
                                            <a href="injectables/ShipmentsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules"}>ShipmentsService</a>
                                        </li>
                                </ul>
                            </li>
                    </li>
                    <li class="link">
                        <a href="modules/SearchOrderMenuModule.html" data-type="entity-link">SearchOrderMenuModule</a>
                            <li class="chapter inner">
                                <div class="simple menu-toggler" data-toggle="collapse"
                                    ${ isNormalMode ? 'data-target="#components-links-module-SearchOrderMenuModule-c013f36cabd6a02cf3aa375ea4da72da"' : 'data-target="#xs-components-links-module-SearchOrderMenuModule-c013f36cabd6a02cf3aa375ea4da72da"' }>
                                    <span class="icon ion-md-cog"></span>
                                    <span>Components</span>
                                    <span class="icon ion-ios-arrow-down"></span>
                                </div>
                                <ul class="links collapse"
                                    ${ isNormalMode ? 'id="components-links-module-SearchOrderMenuModule-c013f36cabd6a02cf3aa375ea4da72da"' : 'id="xs-components-links-module-SearchOrderMenuModule-c013f36cabd6a02cf3aa375ea4da72da"' }>
                                        <li class="link">
                                            <a href="components/SearchBillingFormComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">SearchBillingFormComponent</a>
                                        </li>
                                        <li class="link">
                                            <a href="components/SearchEnviosExitoFormComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">SearchEnviosExitoFormComponent</a>
                                        </li>
                                        <li class="link">
                                            <a href="components/SearchOrderFormComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">SearchOrderFormComponent</a>
                                        </li>
                                        <li class="link">
                                            <a href="components/SearchOrderMenuComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">SearchOrderMenuComponent</a>
                                        </li>
                                        <li class="link">
                                            <a href="components/SearchPendingDevolutionFormComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">SearchPendingDevolutionFormComponent</a>
                                        </li>
                                </ul>
                            </li>
                            <li class="chapter inner">
                                <div class="simple menu-toggler" data-toggle="collapse"
                                    ${ isNormalMode ? 'data-target="#injectables-links-module-SearchOrderMenuModule-c013f36cabd6a02cf3aa375ea4da72da"' : 'data-target="#xs-injectables-links-module-SearchOrderMenuModule-c013f36cabd6a02cf3aa375ea4da72da"' }>
                                    <span class="icon ion-md-arrow-round-down"></span>
                                    <span>Injectables</span>
                                    <span class="icon ion-ios-arrow-down"></span>
                                </div>
                                <ul class="links collapse"
                                    ${ isNormalMode ? 'id="injectables-links-module-SearchOrderMenuModule-c013f36cabd6a02cf3aa375ea4da72da"' : 'id="xs-injectables-links-module-SearchOrderMenuModule-c013f36cabd6a02cf3aa375ea4da72da"' }>
                                        <li class="link">
                                            <a href="injectables/SearchOrderMenuService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules"}>SearchOrderMenuService</a>
                                        </li>
                                </ul>
                            </li>
                    </li>
                    <li class="link">
                        <a href="modules/SecureModule.html" data-type="entity-link">SecureModule</a>
                    </li>
                    <li class="link">
                        <a href="modules/SharedModule.html" data-type="entity-link">SharedModule</a>
                            <li class="chapter inner">
                                <div class="simple menu-toggler" data-toggle="collapse"
                                    ${ isNormalMode ? 'data-target="#components-links-module-SharedModule-d9e0a419571518987e9e24d1590f3df4"' : 'data-target="#xs-components-links-module-SharedModule-d9e0a419571518987e9e24d1590f3df4"' }>
                                    <span class="icon ion-md-cog"></span>
                                    <span>Components</span>
                                    <span class="icon ion-ios-arrow-down"></span>
                                </div>
                                <ul class="links collapse"
                                    ${ isNormalMode ? 'id="components-links-module-SharedModule-d9e0a419571518987e9e24d1590f3df4"' : 'id="xs-components-links-module-SharedModule-d9e0a419571518987e9e24d1590f3df4"' }>
                                        <li class="link">
                                            <a href="components/SearchSellerComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">SearchSellerComponent</a>
                                        </li>
                                </ul>
                            </li>
                            <li class="chapter inner">
                                <div class="simple menu-toggler" data-toggle="collapse"
                                    ${ isNormalMode ? 'data-target="#directives-links-module-SharedModule-d9e0a419571518987e9e24d1590f3df4"' : 'data-target="#xs-directives-links-module-SharedModule-d9e0a419571518987e9e24d1590f3df4"' }>
                                    <span class="icon ion-md-code-working"></span>
                                    <span>Directives</span>
                                    <span class="icon ion-ios-arrow-down"></span>
                                </div>
                                <ul class="links collapse"
                                    ${ isNormalMode ? 'id="directives-links-module-SharedModule-d9e0a419571518987e9e24d1590f3df4"' : 'id="xs-directives-links-module-SharedModule-d9e0a419571518987e9e24d1590f3df4"' }>
                                        <li class="link">
                                            <a href="directives/CdkDetailRowDirective.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">CdkDetailRowDirective</a>
                                        </li>
                                        <li class="link">
                                            <a href="directives/NoWhitespaceDirective.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">NoWhitespaceDirective</a>
                                        </li>
                                </ul>
                            </li>
                            <li class="chapter inner">
                                <div class="simple menu-toggler" data-toggle="collapse"
                                    ${ isNormalMode ? 'data-target="#injectables-links-module-SharedModule-d9e0a419571518987e9e24d1590f3df4"' : 'data-target="#xs-injectables-links-module-SharedModule-d9e0a419571518987e9e24d1590f3df4"' }>
                                    <span class="icon ion-md-arrow-round-down"></span>
                                    <span>Injectables</span>
                                    <span class="icon ion-ios-arrow-down"></span>
                                </div>
                                <ul class="links collapse"
                                    ${ isNormalMode ? 'id="injectables-links-module-SharedModule-d9e0a419571518987e9e24d1590f3df4"' : 'id="xs-injectables-links-module-SharedModule-d9e0a419571518987e9e24d1590f3df4"' }>
                                        <li class="link">
                                            <a href="injectables/EventEmitterSeller.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules"}>EventEmitterSeller</a>
                                        </li>
                                </ul>
                            </li>
                    </li>
                    <li class="link">
                        <a href="modules/ShellModule.html" data-type="entity-link">ShellModule</a>
                            <li class="chapter inner">
                                <div class="simple menu-toggler" data-toggle="collapse"
                                    ${ isNormalMode ? 'data-target="#components-links-module-ShellModule-57a1cd897702010c6e5fe03c08dd8bf9"' : 'data-target="#xs-components-links-module-ShellModule-57a1cd897702010c6e5fe03c08dd8bf9"' }>
                                    <span class="icon ion-md-cog"></span>
                                    <span>Components</span>
                                    <span class="icon ion-ios-arrow-down"></span>
                                </div>
                                <ul class="links collapse"
                                    ${ isNormalMode ? 'id="components-links-module-ShellModule-57a1cd897702010c6e5fe03c08dd8bf9"' : 'id="xs-components-links-module-ShellModule-57a1cd897702010c6e5fe03c08dd8bf9"' }>
                                        <li class="link">
                                            <a href="components/HeaderComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">HeaderComponent</a>
                                        </li>
                                        <li class="link">
                                            <a href="components/ShellComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">ShellComponent</a>
                                        </li>
                                        <li class="link">
                                            <a href="components/SidebarComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">SidebarComponent</a>
                                        </li>
                                        <li class="link">
                                            <a href="components/ToolbarLinkComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">ToolbarLinkComponent</a>
                                        </li>
                                </ul>
                            </li>
                    </li>
                    <li class="link">
                        <a href="modules/ShippingMethodsModule.html" data-type="entity-link">ShippingMethodsModule</a>
                            <li class="chapter inner">
                                <div class="simple menu-toggler" data-toggle="collapse"
                                    ${ isNormalMode ? 'data-target="#components-links-module-ShippingMethodsModule-1ec6ca90a0d29a0ba2c27a500e21c05e"' : 'data-target="#xs-components-links-module-ShippingMethodsModule-1ec6ca90a0d29a0ba2c27a500e21c05e"' }>
                                    <span class="icon ion-md-cog"></span>
                                    <span>Components</span>
                                    <span class="icon ion-ios-arrow-down"></span>
                                </div>
                                <ul class="links collapse"
                                    ${ isNormalMode ? 'id="components-links-module-ShippingMethodsModule-1ec6ca90a0d29a0ba2c27a500e21c05e"' : 'id="xs-components-links-module-ShippingMethodsModule-1ec6ca90a0d29a0ba2c27a500e21c05e"' }>
                                        <li class="link">
                                            <a href="components/ShippingMethodsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">ShippingMethodsComponent</a>
                                        </li>
                                </ul>
                            </li>
                            <li class="chapter inner">
                                <div class="simple menu-toggler" data-toggle="collapse"
                                    ${ isNormalMode ? 'data-target="#injectables-links-module-ShippingMethodsModule-1ec6ca90a0d29a0ba2c27a500e21c05e"' : 'data-target="#xs-injectables-links-module-ShippingMethodsModule-1ec6ca90a0d29a0ba2c27a500e21c05e"' }>
                                    <span class="icon ion-md-arrow-round-down"></span>
                                    <span>Injectables</span>
                                    <span class="icon ion-ios-arrow-down"></span>
                                </div>
                                <ul class="links collapse"
                                    ${ isNormalMode ? 'id="injectables-links-module-ShippingMethodsModule-1ec6ca90a0d29a0ba2c27a500e21c05e"' : 'id="xs-injectables-links-module-ShippingMethodsModule-1ec6ca90a0d29a0ba2c27a500e21c05e"' }>
                                        <li class="link">
                                            <a href="injectables/ShippingMethodsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules"}>ShippingMethodsService</a>
                                        </li>
                                </ul>
                            </li>
                    </li>
                    <li class="link">
                        <a href="modules/StatesModule.html" data-type="entity-link">StatesModule</a>
                            <li class="chapter inner">
                                <div class="simple menu-toggler" data-toggle="collapse"
                                    ${ isNormalMode ? 'data-target="#components-links-module-StatesModule-6b12a9eadda87de7a24967bc12165c77"' : 'data-target="#xs-components-links-module-StatesModule-6b12a9eadda87de7a24967bc12165c77"' }>
                                    <span class="icon ion-md-cog"></span>
                                    <span>Components</span>
                                    <span class="icon ion-ios-arrow-down"></span>
                                </div>
                                <ul class="links collapse"
                                    ${ isNormalMode ? 'id="components-links-module-StatesModule-6b12a9eadda87de7a24967bc12165c77"' : 'id="xs-components-links-module-StatesModule-6b12a9eadda87de7a24967bc12165c77"' }>
                                        <li class="link">
                                            <a href="components/StatesComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">StatesComponent</a>
                                        </li>
                                </ul>
                            </li>
                    </li>
                    <li class="link">
                        <a href="modules/StoresModule.html" data-type="entity-link">StoresModule</a>
                            <li class="chapter inner">
                                <div class="simple menu-toggler" data-toggle="collapse"
                                    ${ isNormalMode ? 'data-target="#components-links-module-StoresModule-a37827b940ccdbeb5a7bec3b6654d3cd"' : 'data-target="#xs-components-links-module-StoresModule-a37827b940ccdbeb5a7bec3b6654d3cd"' }>
                                    <span class="icon ion-md-cog"></span>
                                    <span>Components</span>
                                    <span class="icon ion-ios-arrow-down"></span>
                                </div>
                                <ul class="links collapse"
                                    ${ isNormalMode ? 'id="components-links-module-StoresModule-a37827b940ccdbeb5a7bec3b6654d3cd"' : 'id="xs-components-links-module-StoresModule-a37827b940ccdbeb5a7bec3b6654d3cd"' }>
                                        <li class="link">
                                            <a href="components/InputCommisionComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">InputCommisionComponent</a>
                                        </li>
                                        <li class="link">
                                            <a href="components/NoContentComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">NoContentComponent</a>
                                        </li>
                                        <li class="link">
                                            <a href="components/SearchStoreComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">SearchStoreComponent</a>
                                        </li>
                                        <li class="link">
                                            <a href="components/StoreComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">StoreComponent</a>
                                        </li>
                                        <li class="link">
                                            <a href="components/TreeCategoriesComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">TreeCategoriesComponent</a>
                                        </li>
                                        <li class="link">
                                            <a href="components/TreeComponentComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">TreeComponentComponent</a>
                                        </li>
                                        <li class="link">
                                            <a href="components/TreeToolbarComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">TreeToolbarComponent</a>
                                        </li>
                                </ul>
                            </li>
                            <li class="chapter inner">
                                <div class="simple menu-toggler" data-toggle="collapse"
                                    ${ isNormalMode ? 'data-target="#injectables-links-module-StoresModule-a37827b940ccdbeb5a7bec3b6654d3cd"' : 'data-target="#xs-injectables-links-module-StoresModule-a37827b940ccdbeb5a7bec3b6654d3cd"' }>
                                    <span class="icon ion-md-arrow-round-down"></span>
                                    <span>Injectables</span>
                                    <span class="icon ion-ios-arrow-down"></span>
                                </div>
                                <ul class="links collapse"
                                    ${ isNormalMode ? 'id="injectables-links-module-StoresModule-a37827b940ccdbeb5a7bec3b6654d3cd"' : 'id="xs-injectables-links-module-StoresModule-a37827b940ccdbeb5a7bec3b6654d3cd"' }>
                                        <li class="link">
                                            <a href="injectables/EventEmitterStore.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules"}>EventEmitterStore</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/StoresService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules"}>StoresService</a>
                                        </li>
                                </ul>
                            </li>
                    </li>
                    <li class="link">
                        <a href="modules/StoresRoutingModule.html" data-type="entity-link">StoresRoutingModule</a>
                    </li>
                    <li class="link">
                        <a href="modules/SupportModule.html" data-type="entity-link">SupportModule</a>
                            <li class="chapter inner">
                                <div class="simple menu-toggler" data-toggle="collapse"
                                    ${ isNormalMode ? 'data-target="#components-links-module-SupportModule-349dab307c161581c065b42c56c10b99"' : 'data-target="#xs-components-links-module-SupportModule-349dab307c161581c065b42c56c10b99"' }>
                                    <span class="icon ion-md-cog"></span>
                                    <span>Components</span>
                                    <span class="icon ion-ios-arrow-down"></span>
                                </div>
                                <ul class="links collapse"
                                    ${ isNormalMode ? 'id="components-links-module-SupportModule-349dab307c161581c065b42c56c10b99"' : 'id="xs-components-links-module-SupportModule-349dab307c161581c065b42c56c10b99"' }>
                                        <li class="link">
                                            <a href="components/SupportModalComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">SupportModalComponent</a>
                                        </li>
                                </ul>
                            </li>
                            <li class="chapter inner">
                                <div class="simple menu-toggler" data-toggle="collapse"
                                    ${ isNormalMode ? 'data-target="#injectables-links-module-SupportModule-349dab307c161581c065b42c56c10b99"' : 'data-target="#xs-injectables-links-module-SupportModule-349dab307c161581c065b42c56c10b99"' }>
                                    <span class="icon ion-md-arrow-round-down"></span>
                                    <span>Injectables</span>
                                    <span class="icon ion-ios-arrow-down"></span>
                                </div>
                                <ul class="links collapse"
                                    ${ isNormalMode ? 'id="injectables-links-module-SupportModule-349dab307c161581c065b42c56c10b99"' : 'id="xs-injectables-links-module-SupportModule-349dab307c161581c065b42c56c10b99"' }>
                                        <li class="link">
                                            <a href="injectables/SupportService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules"}>SupportService</a>
                                        </li>
                                </ul>
                            </li>
                    </li>
                    <li class="link">
                        <a href="modules/ToolbarOptionsModule.html" data-type="entity-link">ToolbarOptionsModule</a>
                            <li class="chapter inner">
                                <div class="simple menu-toggler" data-toggle="collapse"
                                    ${ isNormalMode ? 'data-target="#components-links-module-ToolbarOptionsModule-7e64bd00dead969e5b190940fa757d99"' : 'data-target="#xs-components-links-module-ToolbarOptionsModule-7e64bd00dead969e5b190940fa757d99"' }>
                                    <span class="icon ion-md-cog"></span>
                                    <span>Components</span>
                                    <span class="icon ion-ios-arrow-down"></span>
                                </div>
                                <ul class="links collapse"
                                    ${ isNormalMode ? 'id="components-links-module-ToolbarOptionsModule-7e64bd00dead969e5b190940fa757d99"' : 'id="xs-components-links-module-ToolbarOptionsModule-7e64bd00dead969e5b190940fa757d99"' }>
                                        <li class="link">
                                            <a href="components/ToolbarOptionsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">ToolbarOptionsComponent</a>
                                        </li>
                                </ul>
                            </li>
                    </li>
                    <li class="link">
                        <a href="modules/ToolbarTittleModule.html" data-type="entity-link">ToolbarTittleModule</a>
                            <li class="chapter inner">
                                <div class="simple menu-toggler" data-toggle="collapse"
                                    ${ isNormalMode ? 'data-target="#components-links-module-ToolbarTittleModule-d1774b39811702bd6adc4f05ec2aa5b8"' : 'data-target="#xs-components-links-module-ToolbarTittleModule-d1774b39811702bd6adc4f05ec2aa5b8"' }>
                                    <span class="icon ion-md-cog"></span>
                                    <span>Components</span>
                                    <span class="icon ion-ios-arrow-down"></span>
                                </div>
                                <ul class="links collapse"
                                    ${ isNormalMode ? 'id="components-links-module-ToolbarTittleModule-d1774b39811702bd6adc4f05ec2aa5b8"' : 'id="xs-components-links-module-ToolbarTittleModule-d1774b39811702bd6adc4f05ec2aa5b8"' }>
                                        <li class="link">
                                            <a href="components/ToolbarTittleComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">ToolbarTittleComponent</a>
                                        </li>
                                </ul>
                            </li>
                    </li>
            </ul>
        </li>
                <li class="chapter">
                    <div class="simple menu-toggler" data-toggle="collapse"
                    ${ isNormalMode ? 'data-target="#components-links"' : 'data-target="#xs-components-links"' }>
                        <span class="icon ion-md-cog"></span>
                        <span>Components</span>
                        <span class="icon ion-ios-arrow-down"></span>
                    </div>
                    <ul class="links collapse"
                    ${ isNormalMode ? 'id="components-links"' : 'id="xs-components-links"' }>
                            <li class="link">
                                <a href="components/ConfirmAlertComponent.html" data-type="entity-link">ConfirmAlertComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/FilterComponent-1.html" data-type="entity-link">FilterComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/FilterComponent-2.html" data-type="entity-link">FilterComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/FinishUploadInformationComponent-1.html" data-type="entity-link">FinishUploadInformationComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/HistoricalAdminComponent.html" data-type="entity-link">HistoricalAdminComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/LoadingComponent.html" data-type="entity-link">LoadingComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ModalComponent.html" data-type="entity-link">ModalComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/SearchSellerComponent.html" data-type="entity-link">SearchSellerComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/TableErrorsComponent-1.html" data-type="entity-link">TableErrorsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/TableLoadComponent-1.html" data-type="entity-link">TableLoadComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ToolbarComponent-1.html" data-type="entity-link">ToolbarComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ToolbarComponent-2.html" data-type="entity-link">ToolbarComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ToolbarLinkComponent.html" data-type="entity-link">ToolbarLinkComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ViewCommentComponent-1.html" data-type="entity-link">ViewCommentComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ViewCommentComponent-2.html" data-type="entity-link">ViewCommentComponent</a>
                            </li>
                    </ul>
                </li>
                <li class="chapter">
                    <div class="simple menu-toggler" data-toggle="collapse"
                    ${ isNormalMode ? 'data-target="#directives-links"' : 'data-target="#xs-directives-links"' }>
                        <span class="icon ion-md-code-working"></span>
                        <span>Directives</span>
                        <span class="icon ion-ios-arrow-down"></span>
                    </div>
                    <ul class="links collapse"
                    ${ isNormalMode ? 'id="directives-links"' : 'id="xs-directives-links"' }>
                            <li class="link">
                                <a href="directives/CdkDetailRowDirective.html" data-type="entity-link">CdkDetailRowDirective</a>
                            </li>
                            <li class="link">
                                <a href="directives/NoWhitespaceDirective.html" data-type="entity-link">NoWhitespaceDirective</a>
                            </li>
                    </ul>
                </li>
        <li class="chapter">
            <div class="simple menu-toggler" data-toggle="collapse"
            ${ isNormalMode ? 'data-target="#classes-links"' : 'data-target="#xs-classes-links"' }>
                <span class="icon ion-ios-paper"></span>
                <span>Classes</span>
                <span class="icon ion-ios-arrow-down"></span>
            </div>
            <ul class="links collapse"
            ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                    <li class="link">
                        <a href="classes/AbaliableLoadModel.html" data-type="entity-link">AbaliableLoadModel</a>
                    </li>
                    <li class="link">
                        <a href="classes/AccessTokenCallback.html" data-type="entity-link">AccessTokenCallback</a>
                    </li>
                    <li class="link">
                        <a href="classes/Address.html" data-type="entity-link">Address</a>
                    </li>
                    <li class="link">
                        <a href="classes/Billing.html" data-type="entity-link">Billing</a>
                    </li>
                    <li class="link">
                        <a href="classes/Body.html" data-type="entity-link">Body</a>
                    </li>
                    <li class="link">
                        <a href="classes/Body-1.html" data-type="entity-link">Body</a>
                    </li>
                    <li class="link">
                        <a href="classes/Carrier.html" data-type="entity-link">Carrier</a>
                    </li>
                    <li class="link">
                        <a href="classes/CarrierService.html" data-type="entity-link">CarrierService</a>
                    </li>
                    <li class="link">
                        <a href="classes/Carries.html" data-type="entity-link">Carries</a>
                    </li>
                    <li class="link">
                        <a href="classes/CategoryList.html" data-type="entity-link">CategoryList</a>
                    </li>
                    <li class="link">
                        <a href="classes/Cities.html" data-type="entity-link">Cities</a>
                    </li>
                    <li class="link">
                        <a href="classes/City.html" data-type="entity-link">City</a>
                    </li>
                    <li class="link">
                        <a href="classes/Const.html" data-type="entity-link">Const</a>
                    </li>
                    <li class="link">
                        <a href="classes/Department.html" data-type="entity-link">Department</a>
                    </li>
                    <li class="link">
                        <a href="classes/DetailEntity.html" data-type="entity-link">DetailEntity</a>
                    </li>
                    <li class="link">
                        <a href="classes/DetailFinishUploadInformation.html" data-type="entity-link">DetailFinishUploadInformation</a>
                    </li>
                    <li class="link">
                        <a href="classes/DetailFulfillment.html" data-type="entity-link">DetailFulfillment</a>
                    </li>
                    <li class="link">
                        <a href="classes/FAKE.html" data-type="entity-link">FAKE</a>
                    </li>
                    <li class="link">
                        <a href="classes/FileFlatNode.html" data-type="entity-link">FileFlatNode</a>
                    </li>
                    <li class="link">
                        <a href="classes/FileNode.html" data-type="entity-link">FileNode</a>
                    </li>
                    <li class="link">
                        <a href="classes/FinishUploadInformation.html" data-type="entity-link">FinishUploadInformation</a>
                    </li>
                    <li class="link">
                        <a href="classes/FinishUploadInformation-1.html" data-type="entity-link">FinishUploadInformation</a>
                    </li>
                    <li class="link">
                        <a href="classes/FinishUploadInformation-2.html" data-type="entity-link">FinishUploadInformation</a>
                    </li>
                    <li class="link">
                        <a href="classes/Guide.html" data-type="entity-link">Guide</a>
                    </li>
                    <li class="link">
                        <a href="classes/HttpInterceptorHandler.html" data-type="entity-link">HttpInterceptorHandler</a>
                    </li>
                    <li class="link">
                        <a href="classes/IdTokenCallback.html" data-type="entity-link">IdTokenCallback</a>
                    </li>
                    <li class="link">
                        <a href="classes/InfoClient.html" data-type="entity-link">InfoClient</a>
                    </li>
                    <li class="link">
                        <a href="classes/InformationToForm.html" data-type="entity-link">InformationToForm</a>
                    </li>
                    <li class="link">
                        <a href="classes/IsLoadInformationForTree.html" data-type="entity-link">IsLoadInformationForTree</a>
                    </li>
                    <li class="link">
                        <a href="classes/ListReasonRejectionResponseEntity.html" data-type="entity-link">ListReasonRejectionResponseEntity</a>
                    </li>
                    <li class="link">
                        <a href="classes/ListShipments.html" data-type="entity-link">ListShipments</a>
                    </li>
                    <li class="link">
                        <a href="classes/LoadGuide.html" data-type="entity-link">LoadGuide</a>
                    </li>
                    <li class="link">
                        <a href="classes/Logger.html" data-type="entity-link">Logger</a>
                    </li>
                    <li class="link">
                        <a href="classes/ModelFilter.html" data-type="entity-link">ModelFilter</a>
                    </li>
                    <li class="link">
                        <a href="classes/ModelFilter-1.html" data-type="entity-link">ModelFilter</a>
                    </li>
                    <li class="link">
                        <a href="classes/ModelFilter-2.html" data-type="entity-link">ModelFilter</a>
                    </li>
                    <li class="link">
                        <a href="classes/ModelOffers.html" data-type="entity-link">ModelOffers</a>
                    </li>
                    <li class="link">
                        <a href="classes/ModelProduct.html" data-type="entity-link">ModelProduct</a>
                    </li>
                    <li class="link">
                        <a href="classes/ModelRegister.html" data-type="entity-link">ModelRegister</a>
                    </li>
                    <li class="link">
                        <a href="classes/MyErrorStateMatcher.html" data-type="entity-link">MyErrorStateMatcher</a>
                    </li>
                    <li class="link">
                        <a href="classes/MyErrorStateMatcher-1.html" data-type="entity-link">MyErrorStateMatcher</a>
                    </li>
                    <li class="link">
                        <a href="classes/MyErrorStateMatcher-2.html" data-type="entity-link">MyErrorStateMatcher</a>
                    </li>
                    <li class="link">
                        <a href="classes/MyErrorStateMatcher-3.html" data-type="entity-link">MyErrorStateMatcher</a>
                    </li>
                    <li class="link">
                        <a href="classes/MyErrorStateMatcher-4.html" data-type="entity-link">MyErrorStateMatcher</a>
                    </li>
                    <li class="link">
                        <a href="classes/NewPasswordUser.html" data-type="entity-link">NewPasswordUser</a>
                    </li>
                    <li class="link">
                        <a href="classes/OfferNotifyViewModels.html" data-type="entity-link">OfferNotifyViewModels</a>
                    </li>
                    <li class="link">
                        <a href="classes/OfferNotifyViewModels-1.html" data-type="entity-link">OfferNotifyViewModels</a>
                    </li>
                    <li class="link">
                        <a href="classes/Order.html" data-type="entity-link">Order</a>
                    </li>
                    <li class="link">
                        <a href="classes/OrderDevolutionsModel.html" data-type="entity-link">OrderDevolutionsModel</a>
                    </li>
                    <li class="link">
                        <a href="classes/Package.html" data-type="entity-link">Package</a>
                    </li>
                    <li class="link">
                        <a href="classes/Parameters.html" data-type="entity-link">Parameters</a>
                    </li>
                    <li class="link">
                        <a href="classes/Pending.html" data-type="entity-link">Pending</a>
                    </li>
                    <li class="link">
                        <a href="classes/PickupShipment.html" data-type="entity-link">PickupShipment</a>
                    </li>
                    <li class="link">
                        <a href="classes/Products.html" data-type="entity-link">Products</a>
                    </li>
                    <li class="link">
                        <a href="classes/ProductsEntity.html" data-type="entity-link">ProductsEntity</a>
                    </li>
                    <li class="link">
                        <a href="classes/RegistrationUser.html" data-type="entity-link">RegistrationUser</a>
                    </li>
                    <li class="link">
                        <a href="classes/Remain.html" data-type="entity-link">Remain</a>
                    </li>
                    <li class="link">
                        <a href="classes/ReversionRequestDetailViewModel.html" data-type="entity-link">ReversionRequestDetailViewModel</a>
                    </li>
                    <li class="link">
                        <a href="classes/Route.html" data-type="entity-link">Route</a>
                    </li>
                    <li class="link">
                        <a href="classes/RouteReusableStrategy.html" data-type="entity-link">RouteReusableStrategy</a>
                    </li>
                    <li class="link">
                        <a href="classes/RoutesConst.html" data-type="entity-link">RoutesConst</a>
                    </li>
                    <li class="link">
                        <a href="classes/S3Service.html" data-type="entity-link">S3Service</a>
                    </li>
                    <li class="link">
                        <a href="classes/SearchFormEntity.html" data-type="entity-link">SearchFormEntity</a>
                    </li>
                    <li class="link">
                        <a href="classes/Shipment.html" data-type="entity-link">Shipment</a>
                    </li>
                    <li class="link">
                        <a href="classes/ShipmentEvent.html" data-type="entity-link">ShipmentEvent</a>
                    </li>
                    <li class="link">
                        <a href="classes/ShippingMethodsModel.html" data-type="entity-link">ShippingMethodsModel</a>
                    </li>
                    <li class="link">
                        <a href="classes/State.html" data-type="entity-link">State</a>
                    </li>
                    <li class="link">
                        <a href="classes/State-1.html" data-type="entity-link">State</a>
                    </li>
                    <li class="link">
                        <a href="classes/StoreModel.html" data-type="entity-link">StoreModel</a>
                    </li>
                    <li class="link">
                        <a href="classes/Stuff.html" data-type="entity-link">Stuff</a>
                    </li>
                    <li class="link">
                        <a href="classes/Stuff-1.html" data-type="entity-link">Stuff</a>
                    </li>
                    <li class="link">
                        <a href="classes/TransportModel.html" data-type="entity-link">TransportModel</a>
                    </li>
                    <li class="link">
                        <a href="classes/TypeTransportModel.html" data-type="entity-link">TypeTransportModel</a>
                    </li>
                    <li class="link">
                        <a href="classes/UserInformation.html" data-type="entity-link">UserInformation</a>
                    </li>
                    <li class="link">
                        <a href="classes/ZoneModel.html" data-type="entity-link">ZoneModel</a>
                    </li>
            </ul>
        </li>
                <li class="chapter">
                    <div class="simple menu-toggler" data-toggle="collapse"
                        ${ isNormalMode ? 'data-target="#injectables-links"' : 'data-target="#xs-injectables-links"' }>
                        <span class="icon ion-md-arrow-round-down"></span>
                        <span>Injectables</span>
                        <span class="icon ion-ios-arrow-down"></span>
                    </div>
                    <ul class="links collapse"
                    ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                            <li class="link">
                                <a href="injectables/AwsUtil.html" data-type="entity-link">AwsUtil</a>
                            </li>
                            <li class="link">
                                <a href="injectables/CitiesServices.html" data-type="entity-link">CitiesServices</a>
                            </li>
                            <li class="link">
                                <a href="injectables/CognitoUtil.html" data-type="entity-link">CognitoUtil</a>
                            </li>
                            <li class="link">
                                <a href="injectables/ComponentsService.html" data-type="entity-link">ComponentsService</a>
                            </li>
                            <li class="link">
                                <a href="injectables/DispatchedService.html" data-type="entity-link">DispatchedService</a>
                            </li>
                            <li class="link">
                                <a href="injectables/DownloadHistoricalService.html" data-type="entity-link">DownloadHistoricalService</a>
                            </li>
                            <li class="link">
                                <a href="injectables/DownloadHistoricalService-1.html" data-type="entity-link">DownloadHistoricalService</a>
                            </li>
                            <li class="link">
                                <a href="injectables/DynamoDBService.html" data-type="entity-link">DynamoDBService</a>
                            </li>
                            <li class="link">
                                <a href="injectables/EventEmitterOrders.html" data-type="entity-link">EventEmitterOrders</a>
                            </li>
                            <li class="link">
                                <a href="injectables/EventEmitterSeller.html" data-type="entity-link">EventEmitterSeller</a>
                            </li>
                            <li class="link">
                                <a href="injectables/HttpService.html" data-type="entity-link">HttpService</a>
                            </li>
                            <li class="link">
                                <a href="injectables/InDevolutionService.html" data-type="entity-link">InDevolutionService</a>
                            </li>
                            <li class="link">
                                <a href="injectables/InValidationService.html" data-type="entity-link">InValidationService</a>
                            </li>
                            <li class="link">
                                <a href="injectables/LoadingService.html" data-type="entity-link">LoadingService</a>
                            </li>
                            <li class="link">
                                <a href="injectables/ModalService.html" data-type="entity-link">ModalService</a>
                            </li>
                            <li class="link">
                                <a href="injectables/StatesService.html" data-type="entity-link">StatesService</a>
                            </li>
                            <li class="link">
                                <a href="injectables/ToolbarServiceService.html" data-type="entity-link">ToolbarServiceService</a>
                            </li>
                            <li class="link">
                                <a href="injectables/UserLoginService.html" data-type="entity-link">UserLoginService</a>
                            </li>
                            <li class="link">
                                <a href="injectables/UserParametersService.html" data-type="entity-link">UserParametersService</a>
                            </li>
                            <li class="link">
                                <a href="injectables/UserRegistrationService.html" data-type="entity-link">UserRegistrationService</a>
                            </li>
                    </ul>
                </li>
        <li class="chapter">
            <div class="simple menu-toggler" data-toggle="collapse"
            ${ isNormalMode ? 'data-target="#interceptors-links"' : 'data-target="#xs-interceptors-links"' }>
                <span class="icon ion-ios-swap"></span>
                <span>Interceptors</span>
                <span class="icon ion-ios-arrow-down"></span>
            </div>
            <ul class="links collapse"
            ${ isNormalMode ? 'id="interceptors-links"' : 'id="xs-interceptors-links"' }>
                    <li class="link">
                        <a href="interceptors/AuthInterceptor.html" data-type="entity-link">AuthInterceptor</a>
                    </li>
                    <li class="link">
                        <a href="interceptors/CacheInterceptor.html" data-type="entity-link">CacheInterceptor</a>
                    </li>
                    <li class="link">
                        <a href="interceptors/ErrorHandlerInterceptor.html" data-type="entity-link">ErrorHandlerInterceptor</a>
                    </li>
            </ul>
        </li>
        <li class="chapter">
            <div class="simple menu-toggler" data-toggle="collapse"
                ${ isNormalMode ? 'data-target="#interfaces-links"' : 'data-target="#xs-interfaces-links"' }>
                <span class="icon ion-md-information-circle-outline"></span>
                <span>Interfaces</span>
                <span class="icon ion-ios-arrow-down"></span>
            </div>
            <ul class="links collapse"
            ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                    <li class="link">
                        <a href="interfaces/Callback.html" data-type="entity-link">Callback</a>
                    </li>
                    <li class="link">
                        <a href="interfaces/ChallengeParameters.html" data-type="entity-link">ChallengeParameters</a>
                    </li>
                    <li class="link">
                        <a href="interfaces/CognitoCallback.html" data-type="entity-link">CognitoCallback</a>
                    </li>
                    <li class="link">
                        <a href="interfaces/HttpCacheEntry.html" data-type="entity-link">HttpCacheEntry</a>
                    </li>
                    <li class="link">
                        <a href="interfaces/HttpClient.html" data-type="entity-link">HttpClient</a>
                    </li>
                    <li class="link">
                        <a href="interfaces/LoggedInCallback.html" data-type="entity-link">LoggedInCallback</a>
                    </li>
            </ul>
        </li>
        <li class="chapter">
            <div class="simple menu-toggler" data-toggle="collapse"
            ${ isNormalMode ? 'data-target="#miscellaneous-links"' : 'data-target="#xs-miscellaneous-links"' }>
                <span class="icon ion-ios-cube"></span>
                <span>Miscellaneous</span>
                <span class="icon ion-ios-arrow-down"></span>
            </div>
            <ul class="links collapse"
            ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                    <li class="link">
                      <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                    </li>
                    <li class="link">
                      <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                    </li>
                    <li class="link">
                      <a href="miscellaneous/typealiases.html" data-type="entity-link">Type aliases</a>
                    </li>
                    <li class="link">
                      <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                    </li>
            </ul>
        </li>
        <li class="chapter">
            <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
        </li>
        <li class="divider"></li>
        <li class="copyright">
                Documentation generated using <a href="https://compodoc.app/" target="_blank">
                            <img data-src="images/compodoc-vectorise.svg" class="img-responsive" data-type="compodoc-logo">
                </a>
        </li>
    </ul>
</nav>`);
        this.innerHTML = tp.strings;
    }
});
