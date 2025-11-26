<?php
/**
 * Defines the Visual Editor custom field type class using GrapesJS.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * wphe_acf_field_visual_editor class.
 */
class wphe_acf_field_visual_editor extends \acf_field {
	/**
	 * Controls field type visibility in REST requests.
	 *
	 * @var bool
	 */
	public $show_in_rest = true;

	/**
	 * Environment values relating to the theme or plugin.
	 *
	 * @var array $env Plugin or theme context such as 'url' and 'version'.
	 */
	private $env;

	/**
	 * Constructor.
	 */
	public function __construct() {
		$this->name        = 'visual_editor';
		$this->label       = __( 'Visual Editor', 'acf-visual-editor-field' );
		$this->category    = 'content';
		$this->description = __( 'A GrapesJS visual editor for drag-and-drop content editing.', 'acf-visual-editor-field' );

		$this->defaults = array(
			'editor_height' => 680,
		);

		$this->l10n = array(
			'error' => __( 'Error loading editor', 'acf-visual-editor-field' ),
		);

		$this->env = array(
			'url'     => site_url( str_replace( ABSPATH, '', __DIR__ ) ),
			'version' => '1.0.0',
		);

		parent::__construct();
	}

	/**
	 * Settings to display when users configure a field of this type.
	 *
	 * @param array $field
	 * @return void
	 */
	public function render_field_settings( $field ) {
		acf_render_field_setting(
			$field,
			array(
				'label'        => __( 'Editor Height', 'acf-visual-editor-field' ),
				'instructions' => __( 'Height of the editor in pixels', 'acf-visual-editor-field' ),
				'type'         => 'number',
				'name'         => 'editor_height',
				'min'          => 300,
				'max'          => 1200,
				'append'       => 'px',
			)
		);
	}

	/**
	 * HTML content to show when a publisher edits the field on the edit screen.
	 *
	 * @param array $field The field settings and values.
	 * @return void
	 */
	public function render_field( $field ) {
		$id     = 'gjs-' . esc_attr( $field['key'] );
		$name   = esc_attr( $field['name'] );
		$value  = $field['value'];
		$height = isset( $field['editor_height'] ) ? intval( $field['editor_height'] ) : 600;
		?>
		<div class="acf-grapesjs-wrap" data-field-key="<?php echo esc_attr( $field['key'] ); ?>">
			<!-- Toolbar -->
			<div id="<?php echo $id; ?>-toolbar" class="gjs-toolbar"></div>
			
			<!-- Main Editor Area -->
			<div class="gjs-editor-row" style="height: <?php echo $height; ?>px;">
				<!-- Left Sidebar - Blocks -->
				<div class="gjs-sidebar gjs-sidebar-left">
					<div class="gjs-sidebar-header">Blocks</div>
					<div id="<?php echo $id; ?>-blocks" class="gjs-sidebar-content"></div>
				</div>
				
				<!-- Canvas -->
				<div id="<?php echo $id; ?>" class="gjs-editor"></div>
				
				<!-- Right Sidebar - Settings -->
				<div class="gjs-sidebar gjs-sidebar-right">
					<div class="gjs-tabs">
						<button type="button" class="gjs-tab-btn active" data-tab="styles">Styles</button>
						<button type="button" class="gjs-tab-btn" data-tab="layers">Layers</button>
						<button type="button" class="gjs-tab-btn" data-tab="traits">Settings</button>
					</div>
					<div id="<?php echo $id; ?>-styles" class="gjs-tab-content gjs-sidebar-content"></div>
					<div id="<?php echo $id; ?>-layers" class="gjs-tab-content gjs-sidebar-content" style="display:none;"></div>
					<div id="<?php echo $id; ?>-traits" class="gjs-tab-content gjs-sidebar-content" style="display:none;"></div>
				</div>
			</div>
			
			<!-- Hidden textarea for ACF storage -->
			<textarea 
				name="<?php echo $name; ?>" 
				id="<?php echo $id; ?>-storage" 
				class="gjs-storage" 
				style="display:none;"
			><?php echo esc_textarea( $value ); ?></textarea>
		</div>
		<?php
	}

	/**
	 * Enqueues CSS and JavaScript needed by HTML in the render_field() method.
	 *
	 * @return void
	 */
	public function input_admin_enqueue_scripts() {
		$url     = trailingslashit( $this->env['url'] );
		$version = $this->env['version'];

		// GrapesJS (local files)
		wp_enqueue_style(
			'grapesjs',
			"{$url}assets/css/grapes.min.css",
			array(),
			$version
		);

		wp_enqueue_script(
			'grapesjs',
			"{$url}assets/js/grapes.min.js",
			array(),
			$version,
			true
		);

		// Our custom scripts
		wp_enqueue_style(
			'wphe-visual-editor',
			"{$url}assets/css/field.css",
			array( 'acf-input', 'grapesjs' ),
			$version
		);

		wp_enqueue_script(
			'wphe-visual-editor',
			"{$url}assets/js/field.js",
			array( 'acf-input', 'grapesjs', 'jquery' ),
			$version,
			true
		);
	}

	/**
	 * Sanitize the field value before saving.
	 *
	 * @param mixed $value The value to sanitize.
	 * @param int   $post_id The post ID.
	 * @param array $field The field settings.
	 * @return mixed
	 */
	public function update_value( $value, $post_id, $field ) {
		// Store the raw JSON value (contains html and css)
		return $value;
	}

	/**
	 * Format the field value for front-end output.
	 *
	 * @param mixed $value The field value.
	 * @param int   $post_id The post ID.
	 * @param array $field The field settings.
	 * @return mixed
	 */
	public function format_value( $value, $post_id, $field ) {
		if ( empty( $value ) ) {
			return $value;
		}
		
		// Try to decode JSON format
		$decoded = json_decode( $value, true );
		if ( json_last_error() === JSON_ERROR_NONE && isset( $decoded['html'] ) ) {
			$html = $decoded['html'];
			$css  = isset( $decoded['css'] ) ? $decoded['css'] : '';
			
			$output = '';
			if ( ! empty( $css ) ) {
				$output .= '<style>' . $css . '</style>';
			}
			$output .= $html;
			
			return $output;
		}
		
		// Return as-is if not JSON (legacy format)
		return $value;
	}
}
