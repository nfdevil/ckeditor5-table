/**
 * @license Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/**
 * @module table/commands/inserttablecommand
 */

import Command from '@ckeditor/ckeditor5-core/src/command';
import { findOptimalInsertionPosition } from '@ckeditor/ckeditor5-widget/src/utils';

/**
 * The insert table command.
 *
 * The command is registered by {@link module:table/tableediting~TableEditing} as `'insertTable'` editor command.
 *
 * To insert a table at the current selection, execute the command and specify the dimensions:
 *
 *		editor.execute( 'insertTable', { rows: 20, columns: 5 } );
 *
 * @extends module:core/command~Command
 */
export default class InsertTableCommand extends Command {
	/**
	 * @inheritDoc
	 */
	refresh() {
		const model = this.editor.model;
		const selection = model.document.selection;
		const schema = model.schema;

		const validParent = getInsertTableParent( selection.getFirstPosition() );

		this.isEnabled = schema.checkChild( validParent, 'table' );
	}

	/**
	 * Executes the command.
	 *
	 * Inserts a table with the given number of rows and columns into the editor.
	 *
	 * @param {Object} options
	 * @param {Number} [options.rows=2] The number of rows to create in the inserted table.
	 * @param {Number} [options.columns=2] The number of columns to create in the inserted table.
	 * @fires execute
	 */
	execute( options = {} ) {
		const model = this.editor.model;
		const selection = model.document.selection;
		const tableUtils = this.editor.plugins.get( 'TableUtils' );

		const rows = parseInt( options.rows ) || 2;
		const columns = parseInt( options.columns ) || 2;

		const insertPosition = findOptimalInsertionPosition( selection, model );

		model.change( writer => {
			const table = tableUtils.createTable( writer, rows, columns );

			model.insertContent( table, insertPosition );

			writer.setSelection( writer.createPositionAt( table.getNodeByPath( [ 0, 0, 0 ] ), 0 ) );
		} );
	}
}

// Returns valid parent to insert table
//
// @param {module:engine/model/position} position
function getInsertTableParent( position ) {
	const parent = position.parent;

	return parent === parent.root ? parent : parent.parent;
}
