<?php
/**
 * Plugin Name: ACF Visual Editor Field
 * Description: A custom ACF field type that provides a visual editor powered by GrapesJS.
 * Version: 0.1.0
 * Author: louisho5
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

add_action( 'init', 'wphe_include_acf_field_visual_editor' );

/**
 * Registers the ACF field type.
 */
function wphe_include_acf_field_visual_editor() {
	if ( ! function_exists( 'acf_register_field_type' ) ) {
		return;
	}

	require_once __DIR__ . '/class-wphe-acf-field-visual-editor.php';

	acf_register_field_type( 'wphe_acf_field_visual_editor' );
}

