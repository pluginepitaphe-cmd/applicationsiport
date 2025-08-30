<?php
/**
 * Plugin Name: SIPORTS Integration
 * Description: Intègre l'application SIPORTS React/FastAPI avec WordPress
 * Version: 1.0.0
 * Author: SIPORTS Team
 */

if (!defined('ABSPATH')) {
    exit;
}

class SiportsIntegration {
    private $plugin_url;
    private $plugin_path;
    private $api_url;
    
    public function __construct() {
        $this->plugin_url = plugin_dir_url(__FILE__);
        $this->plugin_path = plugin_dir_path(__FILE__);
        $this->api_url = get_option('siports_api_url', 'https://react-router-upgrade.preview.emergentagent.com/api');
        
        add_action('init', array($this, 'init'));
        add_action('wp_enqueue_scripts', array($this, 'enqueue_scripts'));
        add_action('admin_menu', array($this, 'admin_menu'));
        add_action('admin_init', array($this, 'admin_init'));
        add_shortcode('siports_app', array($this, 'render_siports_app'));
        add_action('rest_api_init', array($this, 'register_api_routes'));
        add_action('wp_login', array($this, 'on_user_login'), 10, 2);
        add_action('wp_logout', array($this, 'on_user_logout'));
        add_action('wp_ajax_siports_get_token', array($this, 'ajax_get_token'));
        add_action('wp_ajax_nopriv_siports_get_token', array($this, 'ajax_get_token'));
    }
    
    public function init() {
        // Enregistrer les types de posts personnalisés
        register_post_type('siports_package', array(
            'labels' => array(
                'name' => 'SIPORTS Packages',
                'singular_name' => 'Package',
                'menu_name' => 'SIPORTS Packages',
                'add_new' => 'Ajouter un package',
                'add_new_item' => 'Ajouter un nouveau package',
                'edit_item' => 'Modifier le package',
                'new_item' => 'Nouveau package',
                'view_item' => 'Voir le package'
            ),
            'public' => true,
            'has_archive' => true,
            'supports' => array('title', 'editor', 'custom-fields', 'thumbnail'),
            'show_in_rest' => true,
            'menu_icon' => 'dashicons-star-filled'
        ));
        
        register_post_type('siports_match', array(
            'labels' => array(
                'name' => 'SIPORTS Matches',
                'singular_name' => 'Match',
                'menu_name' => 'SIPORTS Matches'
            ),
            'public' => true,
            'supports' => array('title', 'editor', 'custom-fields'),
            'show_in_rest' => true,
            'menu_icon' => 'dashicons-networking'
        ));
        
        // Créer les tables de synchronisation si nécessaire
        $this->create_sync_tables();
    }
    
    public function admin_menu() {
        add_options_page(
            'Configuration SIPORTS',
            'SIPORTS Config',
            'manage_options',
            'siports-config',
            array($this, 'admin_page')
        );
        
        add_menu_page(
            'SIPORTS Sync',
            'SIPORTS Sync',
            'manage_options',
            'siports-sync',
            array($this, 'sync_page'),
            'dashicons-update'
        );
    }
    
    public function admin_init() {
        register_setting('siports_config', 'siports_api_url');
        register_setting('siports_config', 'siports_jwt_secret');
        register_setting('siports_config', 'siports_auto_sync');
    }
    
    public function admin_page() {
        ?>
        <div class="wrap">
            <h1>Configuration SIPORTS</h1>
            <form method="post" action="options.php">
                <?php settings_fields('siports_config'); ?>
                <?php do_settings_sections('siports_config'); ?>
                <table class="form-table">
                    <tr>
                        <th scope="row">URL API SIPORTS</th>
                        <td>
                            <input type="url" name="siports_api_url" value="<?php echo esc_attr(get_option('siports_api_url', 'https://react-router-upgrade.preview.emergentagent.com/api')); ?>" class="regular-text" />
                            <p class="description">URL de l'API SIPORTS (sans /api à la fin)</p>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">Clé secrète JWT</th>
                        <td>
                            <input type="text" name="siports_jwt_secret" value="<?php echo esc_attr(get_option('siports_jwt_secret', wp_generate_password(32, false))); ?>" class="regular-text" />
                            <p class="description">Clé secrète pour l'authentification JWT (générez une clé aléatoirement)</p>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">Synchronisation automatique</th>
                        <td>
                            <input type="checkbox" name="siports_auto_sync" value="1" <?php checked(get_option('siports_auto_sync'), 1); ?> />
                            <label>Activer la synchronisation automatique des données</label>
                        </td>
                    </tr>
                </table>
                <?php submit_button(); ?>
            </form>
        </div>
        <?php
    }
    
    public function sync_page() {
        ?>
        <div class="wrap">
            <h1>Synchronisation SIPORTS</h1>
            <div class="card">
                <h2>État de la synchronisation</h2>
                <div id="sync-status">
                    <p>Chargement...</p>
                </div>
                <p>
                    <button type="button" class="button button-primary" id="sync-users-btn">Synchroniser les utilisateurs</button>
                    <button type="button" class="button button-primary" id="sync-packages-btn">Synchroniser les packages</button>
                    <button type="button" class="button button-secondary" id="full-sync-btn">Synchronisation complète</button>
                </p>
            </div>
            <div class="card">
                <h2>Historique des synchronisations</h2>
                <div id="sync-history">
                    <p>Aucun historique disponible.</p>
                </div>
            </div>
        </div>
        
        <script>
        jQuery(document).ready(function($) {
            function loadSyncStatus() {
                $.ajax({
                    url: '<?php echo $this->api_url; ?>/sync/status',
                    method: 'GET',
                    headers: {
                        'Authorization': 'Bearer ' + getSiportsToken()
                    },
                    success: function(data) {
                        $('#sync-status').html(
                            '<p><strong>Utilisateurs synchronisés:</strong> ' + data.synced_users + '</p>' +
                            '<p><strong>Packages synchronisés:</strong> ' + data.synced_packages + '</p>' +
                            '<p><strong>Dernière sync utilisateurs:</strong> ' + (data.last_user_sync || 'Jamais') + '</p>' +
                            '<p><strong>Dernière sync packages:</strong> ' + (data.last_package_sync || 'Jamais') + '</p>'
                        );
                    },
                    error: function() {
                        $('#sync-status').html('<p style="color: red;">Erreur lors du chargement du statut</p>');
                    }
                });
            }
            
            function getSiportsToken() {
                // Récupérer le token depuis le cookie ou le localStorage
                return localStorage.getItem('siports_token') || 'demo-token';
            }
            
            $('#sync-users-btn').click(function() {
                $(this).prop('disabled', true).text('Synchronisation...');
                $.ajax({
                    url: '<?php echo $this->api_url; ?>/sync/users',
                    method: 'POST',
                    headers: {
                        'Authorization': 'Bearer ' + getSiportsToken(),
                        'Content-Type': 'application/json'
                    },
                    success: function(data) {
                        alert('Utilisateurs synchronisés: ' + data.records_processed);
                        loadSyncStatus();
                    },
                    error: function() {
                        alert('Erreur lors de la synchronisation des utilisateurs');
                    },
                    complete: function() {
                        $('#sync-users-btn').prop('disabled', false).text('Synchroniser les utilisateurs');
                    }
                });
            });
            
            $('#sync-packages-btn').click(function() {
                $(this).prop('disabled', true).text('Synchronisation...');
                $.ajax({
                    url: '<?php echo $this->api_url; ?>/sync/packages',
                    method: 'POST',
                    headers: {
                        'Authorization': 'Bearer ' + getSiportsToken(),
                        'Content-Type': 'application/json'
                    },
                    success: function(data) {
                        alert('Packages synchronisés: ' + data.records_processed);
                        loadSyncStatus();
                    },
                    error: function() {
                        alert('Erreur lors de la synchronisation des packages');
                    },
                    complete: function() {
                        $('#sync-packages-btn').prop('disabled', false).text('Synchroniser les packages');
                    }
                });
            });
            
            $('#full-sync-btn').click(function() {
                if (!confirm('Êtes-vous sûr de vouloir effectuer une synchronisation complète ?')) {
                    return;
                }
                $(this).prop('disabled', true).text('Synchronisation complète...');
                $.ajax({
                    url: '<?php echo $this->api_url; ?>/sync/full-sync',
                    method: 'POST',
                    headers: {
                        'Authorization': 'Bearer ' + getSiportsToken(),
                        'Content-Type': 'application/json'
                    },
                    success: function(data) {
                        alert('Synchronisation complète terminée');
                        loadSyncStatus();
                    },
                    error: function() {
                        alert('Erreur lors de la synchronisation complète');
                    },
                    complete: function() {
                        $('#full-sync-btn').prop('disabled', false).text('Synchronisation complète');
                    }
                });
            });
            
            // Charger le statut initial
            loadSyncStatus();
        });
        </script>
        <?php
    }
    
    public function enqueue_scripts() {
        if (is_admin()) return;
        
        // Enregistrer et charger les scripts React build
        wp_enqueue_script(
            'siports-react-app',
            $this->plugin_url . 'build/static/js/main.js',
            array('jquery'),
            '1.0.0',
            true
        );
        
        wp_enqueue_style(
            'siports-react-styles',
            $this->plugin_url . 'build/static/css/main.css',
            array(),
            '1.0.0'
        );
        
        // Localiser le script avec les données WordPress
        wp_localize_script('siports-react-app', 'siportsConfig', array(
            'apiUrl' => $this->api_url,
            'wpApiUrl' => rest_url('siports/v1/'),
            'nonce' => wp_create_nonce('wp_rest'),
            'currentUser' => $this->get_current_user_data(),
            'siteUrl' => get_site_url(),
            'pluginUrl' => $this->plugin_url
        ));
        
        // Ajouter le CSS personnalisé
        wp_add_inline_style('siports-react-styles', '
            .siports-react-container {
                min-height: 400px;
                background: #f9f9f9;
                border-radius: 8px;
                padding: 20px;
                margin: 20px 0;
            }
            .siports-loading {
                text-align: center;
                padding: 40px;
                font-size: 18px;
                color: #666;
            }
            .siports-wordpress-app {
                width: 100%;
                min-height: inherit;
            }
        ');
    }
    
    public function render_siports_app($atts) {
        $attributes = shortcode_atts(array(
            'component' => 'main',
            'id' => 'siports-app-' . uniqid(),
            'height' => '600px',
            'width' => '100%'
        ), $atts);
        
        return sprintf(
            '<div id="%s" class="siports-react-container" data-component="%s" style="min-height: %s; width: %s;">
                <div class="siports-loading">
                    <div style="display: inline-block; margin-right: 10px;">⚓</div>
                    Chargement de SIPORTS...
                </div>
            </div>',
            esc_attr($attributes['id']),
            esc_attr($attributes['component']),
            esc_attr($attributes['height']),
            esc_attr($attributes['width'])
        );
    }
    
    public function register_api_routes() {
        register_rest_route('siports/v1', '/sync', array(
            'methods' => 'POST',
            'callback' => array($this, 'handle_sync_request'),
            'permission_callback' => array($this, 'verify_sync_permission')
        ));
        
        register_rest_route('siports/v1', '/user-data', array(
            'methods' => 'GET',
            'callback' => array($this, 'get_user_data'),
            'permission_callback' => 'is_user_logged_in'
        ));
        
        register_rest_route('siports/v1', '/status', array(
            'methods' => 'GET',
            'callback' => array($this, 'get_status'),
            'permission_callback' => '__return_true'
        ));
    }
    
    public function handle_sync_request($request) {
        $sync_type = $request->get_param('type');
        
        $response = wp_remote_post($this->api_url . '/sync/' . $sync_type, array(
            'headers' => array(
                'Authorization' => 'Bearer ' . $this->get_api_token(),
                'Content-Type' => 'application/json'
            ),
            'body' => json_encode($request->get_params()),
            'timeout' => 30
        ));
        
        if (is_wp_error($response)) {
            return new WP_Error('sync_failed', 'Synchronization failed: ' . $response->get_error_message(), array('status' => 500));
        }
        
        return json_decode(wp_remote_retrieve_body($response), true);
    }
    
    public function get_user_data($request) {
        if (!is_user_logged_in()) {
            return new WP_Error('not_authenticated', 'User not authenticated', array('status' => 401));
        }
        
        return $this->get_current_user_data();
    }
    
    public function get_status($request) {
        return array(
            'status' => 'active',
            'version' => '1.0.0',
            'wordpress_version' => get_bloginfo('version'),
            'api_url' => $this->api_url,
            'last_sync' => get_option('siports_last_sync', 'Never')
        );
    }
    
    public function verify_sync_permission($request) {
        return current_user_can('manage_options');
    }
    
    public function on_user_login($user_login, $user) {
        // Générer un token SIPORTS quand l'utilisateur se connecte à WordPress
        $token = $this->generate_token_for_user($user);
        if ($token) {
            update_user_meta($user->ID, 'siports_token', $token);
            setcookie('siports_token', $token, time() + (24 * 60 * 60), '/', '', is_ssl(), true);
        }
    }
    
    public function on_user_logout() {
        // Effacer le token SIPORTS lors de la déconnexion
        setcookie('siports_token', '', time() - 3600, '/', '', is_ssl(), true);
        if (is_user_logged_in()) {
            delete_user_meta(get_current_user_id(), 'siports_token');
        }
    }
    
    public function ajax_get_token() {
        if (!is_user_logged_in()) {
            wp_send_json_error('Not authenticated');
            return;
        }
        
        $user = wp_get_current_user();
        $token = get_user_meta($user->ID, 'siports_token', true);
        
        if (empty($token)) {
            $token = $this->generate_token_for_user($user);
            if ($token) {
                update_user_meta($user->ID, 'siports_token', $token);
            }
        }
        
        wp_send_json_success(array('token' => $token));
    }
    
    private function generate_token_for_user($user) {
        $user_capabilities = array_keys($user->caps);
        
        $response = wp_remote_post($this->api_url . '/auth/wordpress-login', array(
            'headers' => array('Content-Type' => 'application/json'),
            'body' => json_encode(array(
                'username' => $user->user_login,
                'email' => $user->user_email,
                'wp_auth' => true,
                'user_id' => $user->ID,
                'capabilities' => $user_capabilities,
                'display_name' => $user->display_name
            )),
            'timeout' => 15
        ));
        
        if (is_wp_error($response)) {
            error_log('SIPORTS token generation failed: ' . $response->get_error_message());
            return false;
        }
        
        $body = json_decode(wp_remote_retrieve_body($response), true);
        return isset($body['access_token']) ? $body['access_token'] : false;
    }
    
    private function get_api_token() {
        $token = get_transient('siports_admin_token');
        if (!$token) {
            $token = $this->refresh_admin_token();
            if ($token) {
                set_transient('siports_admin_token', $token, HOUR_IN_SECONDS);
            }
        }
        return $token;
    }
    
    private function refresh_admin_token() {
        $admin_user = wp_get_current_user();
        if ($admin_user && user_can($admin_user, 'administrator')) {
            return $this->generate_token_for_user($admin_user);
        }
        return false;
    }
    
    private function get_current_user_data() {
        if (!is_user_logged_in()) {
            return array('ID' => 0, 'logged_in' => false);
        }
        
        $user = wp_get_current_user();
        return array(
            'ID' => $user->ID,
            'login' => $user->user_login,
            'email' => $user->user_email,
            'display_name' => $user->display_name,
            'roles' => $user->roles,
            'capabilities' => array_keys($user->caps),
            'logged_in' => true
        );
    }
    
    private function create_sync_tables() {
        global $wpdb;
        
        $table_name = $wpdb->prefix . 'siports_sync_log';
        
        $charset_collate = $wpdb->get_charset_collate();
        
        $sql = "CREATE TABLE $table_name (
            id mediumint(9) NOT NULL AUTO_INCREMENT,
            sync_type varchar(50) NOT NULL,
            sync_direction varchar(20) NOT NULL,
            records_processed int NOT NULL DEFAULT 0,
            success tinyint(1) NOT NULL DEFAULT 0,
            error_message text,
            sync_time datetime DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (id)
        ) $charset_collate;";
        
        require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
        dbDelta($sql);
    }
}

// Initialiser le plugin
new SiportsIntegration();

// Hook d'activation
register_activation_hook(__FILE__, function() {
    // Créer les options par défaut
    add_option('siports_api_url', 'https://react-router-upgrade.preview.emergentagent.com/api');
    add_option('siports_jwt_secret', wp_generate_password(32, false));
    add_option('siports_auto_sync', 0);
    
    // Forcer la création des tables
    global $wpdb;
    $table_name = $wpdb->prefix . 'siports_sync_log';
    $charset_collate = $wpdb->get_charset_collate();
    
    $sql = "CREATE TABLE IF NOT EXISTS $table_name (
        id mediumint(9) NOT NULL AUTO_INCREMENT,
        sync_type varchar(50) NOT NULL,
        sync_direction varchar(20) NOT NULL,
        records_processed int NOT NULL DEFAULT 0,
        success tinyint(1) NOT NULL DEFAULT 0,
        error_message text,
        sync_time datetime DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id)
    ) $charset_collate;";
    
    require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
    dbDelta($sql);
});

// Hook de désactivation
register_deactivation_hook(__FILE__, function() {
    // Nettoyer les tokens et cookies
    wp_clear_scheduled_hook('siports_auto_sync');
});
?>