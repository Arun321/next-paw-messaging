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
<!--                @submit.prevent="submitForm"-->
                <form>
                    <div class="modal-body">
                        <div class="form-group">
                            <label for="firstname">First Name</label>
                            <input v-model="Users.firstName" type="text" class="form-control" id="firstname" aria-describedby="emailHelp" placeholder="First Name">
                        </div>
                        <div class="form-group">
                            <label for="lastname">Last Name</label>
                            <input v-model="Users.lastName" type="text" class="form-control" id="lastname" placeholder="Last Name">
                        </div>
                        <div class="form-group">
                            <label for="MobilePhone">Mobile Phone</label>
                            <input v-model="Users.mobilePhone" type="text" class="form-control" id="MobilePhone" placeholder="Mobile Phone">
                        </div>
                        <div class="form-group">
                            <label for="EmailAddress">Email Address</label>
                            <input v-model="Users.emailAddress" type="email" class="form-control" id="EmailAddress" placeholder="Email Address">
                            <small id="emailOptional" class="form-text text-muted">(Optional)</small>
                        </div>
                        <div class="form-group">
                            <label for="PetsName">Pets Name</label>
                            <input v-model="Users.petsName" type="text" class="form-control" id="PetsName" placeholder="Pets Name">
                            <small id="nameOptional" class="form-text text-muted">(Optional)</small>
                        </div>
                        <div class="form-group date">
                            <label for="petdate">Pets Birthday</label>
                            <input v-model="Users.petsBirthday" type="date" class="form-control" name="date" id="petdate" placeholder="dd.mm.yyyy">
                            <small id="dateOptional" class="form-text text-muted">(Optional)</small>
                        </div>
                    </div>
                    <div class="modal-footer border-top-0 d-flex justify-content-center">
                        <button type="submit" value="Add Contact" class="btn btn-success" @click.prevent="submitForm">Save</button>
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
                 Users: {
                    firstName: '',
                    lastName: '',
                    mobilePhone: '',
                    emailAddress: '',
                    petsName: null,
                    petsBirthday: null,
                    submitData: '',
                    submitError: '',
                    errorInfo: ''
                }
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
                                                first_name:"${this.Users.firstName}",
                                                last_name: "${this.Users.lastName}",
                                                email: "${this.Users.emailAddress}",
                                                mobile_number: "${this.Users.mobilePhone}",
                                                pet_name: "${this.Users.petsName}",
                                                pet_birthday: "${this.Users.petsBirthday}",
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
                    this.errorInfo = response.data.data.contactMutation.message;
                    if (this.submitError === "1" || this.submitError === "0"){
                        this.$swal(this.errorInfo)
                    }

                }).catch((e) => console.log(e))
                this.Users.firstName = ''
                this.Users.lastName = ''
                this.Users.emailAddress = ''
                this.Users.mobilePhone = ''
                this.Users.petsName = ''
                this.Users.petsBirthday = ''
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
