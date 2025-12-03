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
			<div id="<?php echo $id; ?>-toolbar" class="gjs-custom-toolbar">
				<button type="button" class="gjs-toolbar-btn active" data-device="Desktop" title="Desktop">
					<svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M21,16H3V4H21M21,2H3C1.89,2 1,2.89 1,4V16A2,2 0 0,0 3,18H10V20H8V22H16V20H14V18H21A2,2 0 0,0 23,16V4C23,2.89 22.1,2 21,2Z"/></svg>
				</button>
				<button type="button" class="gjs-toolbar-btn" data-device="Tablet Landscape" title="Tablet Landscape (≤1199px)">
					<svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M19,18H5V6H19M21,4H3C1.89,4 1,4.89 1,6V18A2,2 0 0,0 3,20H21A2,2 0 0,0 23,18V6C23,4.89 22.1,4 21,4Z"/></svg>
				</button>
				<button type="button" class="gjs-toolbar-btn" data-device="Tablet" title="Tablet (≤991px)">
					<svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M12,18H6V6H12M14,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H14A2,2 0 0,0 16,18V6C16,4.89 15.1,4 14,4Z"/></svg>
				</button>
				<button type="button" class="gjs-toolbar-btn" data-device="Mobile" title="Mobile (≤767px)">
					<svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M17,19H7V5H17M17,1H7C5.89,1 5,1.89 5,3V21A2,2 0 0,0 7,23H17A2,2 0 0,0 19,21V3C19,1.89 18.1,1 17,1Z"/></svg>
				</button>
				<span class="gjs-toolbar-separator"></span>
				<button type="button" class="gjs-toolbar-btn active" data-cmd="sw-visibility" title="Toggle Borders">
					<svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M3,3H21V21H3V3M5,5V19H19V5H5Z"/></svg>
				</button>
				<span class="gjs-toolbar-separator"></span>
				<button type="button" class="gjs-toolbar-btn" data-cmd="core:undo" title="Undo">
					<svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M12.5,8C9.85,8 7.45,9 5.6,10.6L2,7V16H11L7.38,12.38C8.77,11.22 10.54,10.5 12.5,10.5C16.04,10.5 19.05,12.81 20.1,16L22.47,15.22C21.08,11.03 17.15,8 12.5,8Z"/></svg>
				</button>
				<button type="button" class="gjs-toolbar-btn" data-cmd="core:redo" title="Redo">
					<svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M18.4,10.6C16.55,9 14.15,8 11.5,8C6.85,8 2.92,11.03 1.54,15.22L3.9,16C4.95,12.81 7.95,10.5 11.5,10.5C13.45,10.5 15.23,11.22 16.62,12.38L13,16H22V7L18.4,10.6Z"/></svg>
				</button>
				<span class="gjs-toolbar-spacer"></span>
				<span class="gjs-device-info">Desktop</span>
				<button type="button" class="gjs-toolbar-btn" data-cmd="fullscreen" title="Fullscreen">
					<svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M5,5H10V7H7V10H5V5M14,5H19V10H17V7H14V5M17,14H19V19H14V17H17V14M10,17V19H5V14H7V17H10Z"/></svg>
				</button>
			</div>
			
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
					<div id="<?php echo $id; ?>-traits" class="gjs-tab-content gjs-sidebar-content" style="display:none;">
						<!-- Custom CSS Section -->
						<div class="gjs-custom-css-section">
							<div class="gjs-custom-css-header">Custom CSS</div>
							<textarea id="<?php echo $id; ?>-custom-css" class="gjs-custom-css-textarea" placeholder="/* Add your custom CSS here */"></textarea>
						</div>
					</div>
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
			$html       = $decoded['html'];
			$css        = isset( $decoded['css'] ) ? $decoded['css'] : '';
			$custom_css = isset( $decoded['customCss'] ) ? $decoded['customCss'] : '';
			
			$output = '';
			if ( ! empty( $css ) || ! empty( $custom_css ) ) {
				$output .= '<style>' . $css . $custom_css . '</style>';
			}
			$output .= $html;
			
			return $output;
		}
		
		// Return as-is if not JSON (legacy format)
		return $value;
	}
}
