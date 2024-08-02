$(document).ready(function() {
    bindEvents();

    function bindEvents() {
        // config to show toast on top center
        toastr.options = { "positionClass": "toast-top-center" };

        // enable/disable the submit button if url is changed
        $("#bco_custom_db_url").on("input", (event) => {
            $(".btn-submit-custom-bco-db").prop("disabled", !event.target.value);
        });

        // handle event when clicking on the "add/remove credential" button
        $(document).on('click', '.btn-add-credential', addCredential);
        $(document).on('click', '.btn-remove-credential', removeCredential);

        // handle event when clicking on the submit button
        $('.btn-submit-custom-bco-db').on('click', exportFileToCustomBcoDb);
    }

    function exportFileToCustomBcoDb(event) {
        const btnSubmit = event.target;
        const url = $("#bco_custom_db_url").val();

        if (!url) {
            return toastr.error("Please enter data for all fields to upload custom BCO database");
        }

        const setSubmitting = (isSubmitting) => {
            if (isSubmitting) {
                btnSubmit.disabled = true;
                btnSubmit.innerHTML = "Submitting...";
            } else {
                btnSubmit.disabled = false;
                btnSubmit.innerHTML = "Submit";
            }
        };

        // submit form data
        setSubmitting(true);
        $.ajax({
            type: "POST",
            headers: { "X-CSRFToken": getCookie("csrftoken") },
            url: "export_to_custom_bco_db",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({
                url,
                credentials: getCredentials(),
            }),
            success: (message) => {
                toastr.success(message)
                setSubmitting(false);
                $("#bco_custom_db_export_container").modal("hide");
            },
            error: (err) => {
                toastr.error(err.responseText || err.statusText || "Error when exporting file to custom BCO database");
                setSubmitting(false);
            },
        });
    }

    function addCredential() {
        const credentialContainer = $("#credentials-container");
        const credentialRow = $("<div></div>")
            .css("display", "flex")
            .css("gap", "10px")
            .addClass("mb-2")
            .html(`
                <input type="text" class="form-control rounded-lg" placeholder="key" />
                <input type="text" class="form-control rounded-lg" placeholder="value" />
                <button 
                    type="button"
                    class="btn-remove-credential btn btn-outline-danger rounded-lg"
                >
                    Remove
                </button>
            `);
        credentialContainer.append(credentialRow);
    }

    function removeCredential() {
        const button = $(this);
        const credentialRow = button.parent();
        credentialRow.remove();
    }

    function getCredentials() {
        const credentials = {};

        $("#credentials-container > div").each(function() {
            const credentialKey = $(this).find("input[placeholder='key']").val();
            const credentialValue = $(this).find("input[placeholder='value']").val();
    
            if (credentialKey && credentialValue) {
              credentials[credentialKey] = credentialValue;
            }
        });

        return credentials;
    }
});
