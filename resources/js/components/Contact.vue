<template>
    <div class="modal fade" id="addNewContact" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
                <div class="modal-header border-bottom-0">
                    <h5 class="modal-title" id="exampleModalLabel">Add Contact</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <form>
                    <div class="modal-body">
                        <div class="form-group">
                            <label for="firstname">First Name</label>
                            <input type="text" class="form-control" id="firstname" aria-describedby="emailHelp" placeholder="First Name">
                        </div>
                        <div class="form-group">
                            <label for="lastname">Last Name</label>
                            <input type="text" class="form-control" id="lastname" placeholder="Last Name">
                        </div>
                        <div class="form-group">
                            <label for="MobilePhone">Mobile Phone</label>
                            <input type="text" class="form-control" id="MobilePhone" placeholder="Mobile Phone">
                        </div>
                        <div class="form-group">
                            <label for="EmailAddress">Email Address</label>
                            <input type="email" class="form-control" id="EmailAddress" placeholder="Email Address">
                        </div>
                        <div class="form-group">
                            <label for="PetsName">Pets Name</label>
                            <input type="text" class="form-control" id="PetsName" placeholder="Pets Name">
                        </div>
                        <div class="form-group date">
                            <label for="petdate">Pets Birthday</label>
                            <input type="date" class="form-control" name="date" id="petdate" placeholder="dd.mm.yyyy">
                        </div>
                    </div>
                    <div class="modal-footer border-top-0 d-flex justify-content-center">
                        <button type="submit" class="btn btn-success">Save</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Contact",
        methods: {

        }
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
