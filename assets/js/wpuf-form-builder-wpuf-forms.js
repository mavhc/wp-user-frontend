;(function($) {
    'use strict';

    /**
     * Only proceed if current page is a 'Post Forms' form builder page
     */
    if (!$('#wpuf-form-builder.wpuf-form-builder-post').length) {
        return;
    }

    window.mixin_builder_stage = {
        data: function () {
            return {
                post_form_settings: {
                    submit_text: '',
                    draft_post: false,
                }
            };
        },

        mounted: function () {
            var self = this;

            // submit button text
            this.post_form_settings.submit_text = $('[name="wpuf_settings[submit_text]"]').val();

            $('[name="wpuf_settings[submit_text]"]').on('change', function () {
                self.post_form_settings.submit_text = $(this).val();
            });

            // draft post text
            this.post_form_settings.draft_post = $('[type="checkbox"][name="wpuf_settings[draft_post]"]').is(':checked') ? true : false;
            $('[type="checkbox"][name="wpuf_settings[draft_post]"]').on('change', function () {
                self.post_form_settings.draft_post = $(this).is(':checked') ? true : false;
            });

            // set taxonomies according to selected post type
            var post_type_dropdown = $('select[name="wpuf_settings[post_type]"]'),
                post_type          = post_type_dropdown.val();

            this.set_taxonomies(post_type);

            post_type_dropdown.on('change', function () {
                self.set_taxonomies($(this).val());
            });
        },

        methods: {
            set_taxonomies: function (post_type) {
                var self       = this,
                    taxonomies = wpuf_form_builder.wp_post_types[post_type],
                    tax_names  = taxonomies ? Object.keys(taxonomies) : [];

                self.$store.commit('set_panel_section_fields', {
                    id: 'taxonomies',
                    fields: tax_names
                });

                // Bind jquery ui draggable. But first destory any previous binding
                Vue.nextTick(function () {
                    var buttons = $('#panel-form-field-buttons-taxonomies .button');

                    buttons.each(function () {
                        if ($(this).draggable('instance')) {
                            $(this).draggable('destroy');
                        }
                    });

                    buttons.draggable({
                        connectToSortable: '#form-preview-stage .wpuf-form',
                        helper: 'clone',
                        revert: 'invalid',
                        cancel: '.button-faded',
                    }).disableSelection();
                });
            },

            // executed in 'builder-stage' component by 'is_template_available' method
            is_post_tags_template_available: function () {
                return true;
            },

            // executed in 'builder-stage' component by 'is_template_available' method
            is_taxonomy_template_available: function (field) {
                return this.field_settings[field.name] ? true : false;
            }
        }
    };

    window.mixin_field_options = {
        methods: {
            form_field_post_tags_title: function () {
                return this.$store.state.field_settings.post_tag.title;
            },

            form_field_taxonomy_title: function (form_field) {
                return this.$store.state.field_settings[form_field.name].title;
            },

            settings_post_tags: function () {
                return this.$store.state.field_settings.post_tag.settings;
            },

            settings_taxonomy: function (form_field) {
                return this.$store.state.field_settings[form_field.name].settings;
            }
        }
    };
})(jQuery);
