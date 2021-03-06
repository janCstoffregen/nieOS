export class AbstractJsonService {
  leafIndices: any = {};
  abstractTree: any = {};
  layerIndex = -1;
  constructor(
  ) {}

  json2abstract( json: any ) {

    this.leafLoop( json, undefined );

    for ( const leaf in this.leafIndices ) {
      this.copyleafIndicesToAbstractTree( leaf );
    }
    for ( const parent in this.abstractTree ) {
      if ( this.abstractTree[ parent ].layerIndex === 1 ) { // TODO Make recursive for arbitrary depth for children of Children
        this.populateChildrenOfChildren( parent );
      }
    }
    this.convertArrayEntriesToObjects();
    return this.abstractTree;
  }

  populateChildrenOfChildren(parent: string) {
    for( const childrenToTest in this.abstractTree[ parent ] ) {
      if( this.abstractTree[childrenToTest] ) {
        this.abstractTree[ parent ][childrenToTest] = this.abstractTree[childrenToTest];
      }
    }
  }

  copyleafIndicesToAbstractTree(leaf: string) {
    if( this.abstractTree[ this.leafIndices[ leaf ].parent ] === undefined ) {
      this.abstractTree[ this.leafIndices[ leaf ].parent ] = [];
    }
    this.abstractTree[ this.leafIndices[ leaf ].parent ][ leaf ] = this.leafIndices[ leaf ] ;
    this.abstractTree[ this.leafIndices[ leaf ].parent ].layerIndex = this.leafIndices[ leaf ].layerIndex;
  }

  convertArrayEntriesToObjects() {
    const help = this.abstractTree;
    this.abstractTree = {};
    for ( const parent in help) {
      if ( help[ parent ].layerIndex === 1 ) { // TODO Make recursive for arbitrary depth for children of Children
        this.abstractTree[ parent ] = {};
        this.goThroughChildrenOfFirstLayerParents( help, parent, this.abstractTree[ parent ] );
      }
    }
  }

  goThroughChildrenOfFirstLayerParents( help: any, parent: any, tree: any ) {
    for ( const children in help[ parent ] ) {
      tree[ children ] = help[ parent ][ children ];
      if ( help[ parent ][ children ].length !== undefined ) {
        tree[ children ] = this.convertArrayToObject( tree[ children ] );
        this.goThroughChildrenOfFirstLayerParents( help, children, tree[ children ] );
      }
    }
  }

  convertArrayToObject( array: any ): any {
    const help = array;
    array = {};
    for ( const entry in help ) {
      array[ entry ] = help[ entry ];
    }
    const object = array;
    return object;
  }

  leafLoop ( leafLayer: any, parent: string ) {
    this.layerIndex += 1;
    for ( const leaf in leafLayer ) {
      if( typeof leafLayer[ leaf ] === 'object' && leafLayer[ leaf ] !== null ) {
        this.addEntryToLeafIndices( leaf, parent, 'array' );
        this.arrayLoop( leafLayer[ leaf ], leaf);
      } else {
        this.addEntryToLeafIndices( leaf, parent, 'string' );
      }
    }
    this.layerIndex -= 1;
  }

  addEntryToLeafIndices( leaf: string, parent: string, type: string ) {
    this.leafIndices[ leaf ] = {};
    this.leafIndices[ leaf ].type = type;
    this.leafIndices[ leaf ].layerIndex = this.layerIndex;
    this.leafIndices[ leaf ].parent = parent;
    this.leafIndices[ leaf ].hash = this.generateHash();
  }

  arrayLoop ( arrayLayer: any, parent: string ) {
    for ( const entry of arrayLayer ) {
      if( entry[ 0 ] === undefined ) {
        this.leafLoop( entry, parent );
      }
    }
  }

  generateHash(): string {
    // console.log('generate Hash');
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < 5; i++) {
      text += possible.charAt(
        Math.floor(Math.random() * possible.length )
      );
    }
    return text;
  }

}

