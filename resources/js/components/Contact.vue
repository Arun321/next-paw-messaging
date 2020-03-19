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
                <form @submit.prevent="submitForm">
                    <div class="modal-body">
                        <div class="form-group">
                            <label for="firstname">First Name</label>
                            <input v-model="firstName" type="text" class="form-control" id="firstname" aria-describedby="emailHelp" placeholder="First Name">
                        </div>
                        <div class="form-group">
                            <label for="lastname">Last Name</label>
                            <input v-model="lastName" type="text" class="form-control" id="lastname" placeholder="Last Name">
                        </div>
                        <div class="form-group">
                            <label for="MobilePhone">Mobile Phone</label>
                            <input v-model="mobilePhone" type="text" class="form-control" id="MobilePhone" placeholder="Mobile Phone">
                        </div>
                        <div class="form-group">
                            <label for="EmailAddress">Email Address</label>
                            <input v-model="emailAddress" type="email" class="form-control" id="EmailAddress" placeholder="Email Address">
                            <medium id="emailOptional" class="form-text text-muted">(Optional)</medium>
                        </div>
                        <div class="form-group">
                            <label for="PetsName">Pets Name</label>
                            <input v-model="petsName" type="text" class="form-control" id="PetsName" placeholder="Pets Name">
                            <medium id="nameOptional" class="form-text text-muted">(Optional)</medium>
                        </div>
                        <div class="form-group date">
                            <label for="petdate">Pets Birthday</label>
                            <input v-model="petsBirthday" type="date" class="form-control" name="date" id="petdate" placeholder="dd.mm.yyyy">
                            <medium id="dateOptional" class="form-text text-muted">(Optional)</medium>
                        </div>
                    </div>
                    <div class="modal-footer border-top-0 d-flex justify-content-center">
                        <button type="submit" value="Add Contact" class="btn btn-success">Save</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Contact",
        data() {
            return {
                submitUser: JSON.parse(localStorage.getItem('user')),
                firstName: '',
                lastName: '',
                mobilePhone: '',
                emailAddress: null,
                petsName: null,
                petsBirthday: null,
                submitData:'',
                submitError:'',
                errorInfo:''
            }
        },
        methods: {
            submitForm() {
                axios({
                    url: 'https://app.nextpaw.com/graph-api',
                    headers: {
                        Authorization: `Bearer ${this.submitUser.token}`
                    },
                    method: 'POST',
                    data: {
                        query: `mutation contactMutation{
                                contactMutation(
                                                first_name: "allen",
                                                last_name: "jane",
                                                email: "allenjane@gmail.com",
                                                mobile_number: "8976543452",
                                                pet_name: ${this.petsName},
                                                pet_birthday: ${this.petsBirthday},
                                                operations: "create",
                                                clientId: 1,
                                                locationId: 1
                                                ){
                                                   first_name
                                                   last_name
                                                   email
                                                   mobile_number
                                                   error
                                                   message
                                                   }
                                 }`
                        }
                     }).then(response => {
                    this.submitData = response.data.data.contactMutation;
                    console.log(this.submitData)
                    this.submitError = response.data.data.contactMutation.error;
                    console.log(this.submitError)
                    this.errorInfo = response.data.data.contactMutation.message;
                    if (this.submitError === "1" || this.submitError === "0"){
                        this.$swal(this.errorInfo)
                    }
                }).catch((e) => console.log(e))
            }
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
