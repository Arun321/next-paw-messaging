<template>
    <!--        modal-->
    <div class="modal fade" id="addNewContact" role="dialog">
        <div class="modal-dialog">
            <!--          modal content  -->
            <div class="modal-content">
                <div class="card new-contact">
                    <button type="button" class="close" data-dismiss="modal">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="col-md-6">
                            <div class="form-group">
                                <label>First Name</label>
                                <input type="text" name="firstname" class="form-control change-field" value required>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-group">
                                <label>Last Name</label>
                                <input type="text" name="lastname" class="form-control change-field" value required>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-group">
                                <label>Mobile Phone</label>
                                <input type="text" name="phone" id="phone" class="form-control input- medium change-field" value required>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-group">
                                <label>Email Address</label>
                                <input type="email" name="email" class="form-control change-field" value required>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-group">
                                <label>Pets Name</label>
                                <input type="pet_name" name="pet_name" class="form-control change-field" value required>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-group">
                                <label>Pets Birthday</label>
                                <input type="text" name="pet_birthday" id="pet_birthday" class="form-control change-field invite-date-font" value readonly="readonly">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <input type="hidden" id="save-url" name="save-url" value="">
                    <button></button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Contact"
    }
</script>

<style scoped>
    /*.new-contact {*/
    /*    border-radius: 50%;*/
    /*    box-shadow: 0 0 0 0.35rem #FFF;*/
    /*    width: 50px;*/
    /*    height: 50px;*/
    /*}*/

</style>
