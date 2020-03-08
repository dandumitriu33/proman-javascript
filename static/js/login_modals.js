export function createRegisterModal() {
  let registerModal = `
<div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
     aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Register</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <form id="register">
                    <div class="form-group">
                        <label for="username">Username</label>
                        <input type="text" class="form-control" id="username"
                               placeholder="Username" required>
                    </div>
                    <div class="form-group">
                        <label for="password">Password</label>
                        <input type="password" class="form-control" id="password" placeholder="Password" required>
                    </div>
                    <button type="submit" class="btn btn-primary">Submit</button>
                    <div id="errorAlert" class="alert alert-danger" role="alert" style="display: none"></div>
                    <div id="successAlert" class="alert alert-success" role="alert" style="display: none"></div>
                </form>
            </div>
        </div>
    </div>
</div>
    `;
  document.querySelector('#register-modal').innerHTML = registerModal;
}



export function createLoginModal() {
  let loginModal = `
    <!-- Modal Login-->
<div class="modal fade" id="loginModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
     aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Login</h5>
                <button type="button" class="close" data-dismiss="modal" id="close-login" aria-label="Close" ">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <form id="login">
                    <div class="form-group">
                        <label for="username">Username</label>
                        <input type="text" class="form-control" id="username-login"
                               placeholder="Username" required>
                    </div>
                    <div class="form-group">
                        <label for="password">Password</label>
                        <input type="password" class="form-control" id="password-login" placeholder="Password" required>
                    </div>
                    <button type="submit" class="btn btn-primary" id="submit-login" >Submit</button>
                    <div id="errorAlert-login" class="alert alert-danger" role="alert" style="display: none"></div>
                    <div id="successAlert-login" class="alert alert-success" role="alert" style="display: none">Logged in</div>
                </form>
            </div>
        </div>
    </div>
</div>
    `;
  document.querySelector('#login-modal').innerHTML = loginModal;
  refreshloginModal();

}


function refreshloginModal() {
  let submitLogin = document.querySelector('#close-login');
  submitLogin.addEventListener('click', function () {
    location.reload();
  });
}

export function renameModal() {
    let renameModal = `<div class="modal fade" id="renameModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
     aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Rename Column</h5>
                <button type="button" class="close" data-dismiss="modal" id="close-login" aria-label="Close" ">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                
            </div>
        </div>
    </div>
</div>`

    renameModal = document.createRange().createContextualFragment(renameModal)
    document.body.appendChild(renameModal);
}
