var app = new Vue({
    el: '#app',
    components: {
        overlayInputEdit: httpVueLoader('components/overlayInputEdit.vue'),
        helpInformation: httpVueLoader('components/helpInformation.vue'),
        mycomponent: httpVueLoader('components/mycomponent.vue'),
        draggable: window['vuedraggable']
    },
    data: {
        showOrangeFace: false,
        darkmode: null,

        loading: false,
        loadinggroups: false,
        refDate: true,
        net: 0,
        tD: 0,
        lastDraw: 0,
        lastResult: 0,
        lengthrow: 5,
        numberballs: 50,
        layers: '5,5,6',

        result_group: "",
        result_group_winning: "",
        result_group_winningAndRef: "",
        result_group_refs: "",
        result_group_numbers: [],
        result_group_numbersToPlay: [],
        result_group_selected_number: [],

        diagram: "",
        output: "",
        inputData: `
        3	8	16	40	43	1
        1	29	33	45	47	2
        14	27	39	46	48	3
        5	25	34	48	50	4
        15	27	33	39	50	5
        `,
        subgroups: {
            'All': {
                winning: [],
                winningAndRef: [],
                refs: []
            }
        },
        selectedGroup: '',
        groupKeys: [],
        workplaces: [],
        selectedWorkplace: {},
        matrix: [],

        //firebase services
        showLogin: true,
        showRegister: false,
        AppInFire: false,
        fireEmail: '',
        firePassword: '',
        fireConfirmPassword: '',
        firePhone: '',
        recaptchaVerifier: '',

        viewTabs: true,
        viewDataInsert: true,
        viewGroups: true,
        viewResult: true,

        deferredPrompt: null,
        installButton: false,
        isMobile: true,

        //---------------
        overlayInputEditShow: false,

    },
    beforeCreate() {

        let workplaces = []; //JSON.parse(localStorage.getItem('workplaces'));
        let workplacesBackup = []; //JSON.parse(localStorage.getItem('workplacesBackup'));

        localforage.getItem('workplaces', (err, value) => {
            workplaces = value
        });
        //--------------------------------------------------------------------
        // create a backup just incase the login destroys everything
        //--------------------------------------------------------------------

        localforage.getItem('workplacesBackup', (err, value) => {
            console.log('Workplaces Backup', workplaces)
            if (err) {
                //if there are workplaces then back it up
                localforage.setItem('workplacesBackup', workplaces, function(err, result) {

                });
                //localStorage.setItem('workplacesBackup', JSON.stringify(workplaces));

            }
        });



    },
    created() {


        this.AppInFire = eval(localStorage.getItem('AppInFire'));
        this.AppInFireEmail = eval(localStorage.getItem('AppInFireEmail'));
        this.darkmode = eval(localStorage.getItem('darkmode'));
        const workplaces = []; //JSON.parse(localStorage.getItem('workplaces'));

        localforage.getItem('workplaces', (err, value) => {
            workplaces = value
        });
        console.log('mounted - workplaces', workplaces)


        // if(this.isMobile() && this.AppInFire){

        //     this.AppInFire = true;
        //     this.showLogin = false;
        //     this.fireEmail = this.AppInFireEmail;
        //     localStorage.setItem('AppInFire', true);

        // }
        //--------------------------------------------------------------------
        //--------------------------------------------------------------------
        // Confirm the link is a sign-in with email link.
        //--------------------------------------------------------------------
        //--------------------------------------------------------------------
        if (firebase.auth().isSignInWithEmailLink(window.location.href)) {
            // Additional state parameters can also be passed via URL.
            // This can be used to continue the user's intended action before triggering
            // the sign-in operation.
            // Get the email if available. This should be available if the user completes
            // the flow on the same device where they started it.
            var email = localStorage.getItem('emailForSignIn');
            if (!email) {
                // User opened the link on a different device. To prevent session fixation
                // attacks, ask the user to provide the associated email again. For example:
                email = window.prompt('Please provide your email for confirmation');
            }
            // The client SDK will parse the code from the link for you.
            firebase.auth().signInWithEmailLink(email, window.location.href)
                .then((result) => {
                    // Clear email from storage.

                    //localStorage.removeItem('emailForSignIn');

                    // You can access the new user via result.user
                    // Additional user info profile not available via:
                    // result.additionalUserInfo.profile == null
                    // You can check if the user is new or existing:
                    // result.additionalUserInfo.isNewUser
                    // Identifier
                    this.AppInFire = true;
                    this.showLogin = false;
                    this.fireEmail = result.user.email;
                    localStorage.setItem('AppInFire', true);
                    localStorage.setItem('AppInFireEmail', result.user.email);


                    console.log('result', result.user.email);

                    if (result.additionalUserInfo.isNewUser) {

                        //if this is a new user take current localstorage and add it to the firestore
                        // db.collection(result.user.email).doc('workplaces').set({
                        //         data: JSON.stringify(workplaces)
                        //     })
                        //     .then(function (docRef) {
                        //         console.log("Document written with ID: ", docRef);
                        //     })
                        //     .catch(function (error) {
                        //         console.error("Error adding document: ", error);
                        //     });
                        this.saveWorkPlace();

                    } else {
                        //if its already an existing login take the data from the firestore   .doc("workplaces")
                        console.log("already have account:", result.user.email);
                        // var docRef = db.collection(result.user.email).doc("workplaces");

                        // docRef.get().then((doc) => {
                        //     if (doc.exists) {
                        //         console.log("workplaces data:", doc.data());
                        //         localStorage.setItem('workplaces', JSON.parse(doc.data().data));

                        //     } else {
                        //         // doc.data() will be undefined in this case
                        //         console.log("No such document!");
                        //     }
                        // }).then(() => {

                        //     this.workplaces = JSON.parse(localStorage.getItem('workplaces'));


                        // }).catch(function (error) {
                        //     console.log("Error getting document:", error);
                        // });
                        var docRef = db.collection(result.user.email);

                        docRef.get().then((doc) => {

                            doc.forEach(element => {

                                console.log("workplaces elet:", element.data());
                            });
                            if (doc.exists) {
                                console.log("workplaces dddd:", doc);
                                //localStorage.setItem('workplaces', JSON.parse(doc.data().data));

                            } else {
                                // doc.data() will be undefined in this case
                                console.log("No such document!");
                            }
                        }).then(() => {

                            //this.workplaces = JSON.parse(localStorage.getItem('workplaces'));


                        }).catch(function(error) {
                            console.log("Error getting document:", error);
                        });
                    }



                })
                .catch(function(error) {
                    console.log("Firestore error :", error);
                    // Some error occurred, you can inspect the code: error.code
                    // Common errors could be invalid email and invalid or expired OTPs.
                });
        } else {

            //if this is in demo mode

            if (workplaces === null) {
                this.workplaces.push({
                    name: 'General',
                    refDate: true,
                    inputData: `
                        3	8	16	40	43	1
                        1	29	33	45	47	2
                        14	27	39	46	48	3
                        5	25	34	48	50	4
                        15	27	33	39	50	5
                        `,
                    layers: '5,5,6',
                    lengthrow: 5,
                    numberballs: 50,
                    groupsConfig: '10,20,30,40,50'
                });

                //localStorage.setItem('workplaces', JSON.stringify(this.workplaces));

                localforage.setItem('workplaces', this.workplaces, function(err, result) {

                });
            } else {
                this.workplaces = workplaces;
            }

        }
        //--------------------------------------------------------------------
        //--------------------------------------------------------------------
        //--------------------------------------------------------------------
        //--------------------------------------------------------------------


    },
    mounted() {
        this.darkmode = eval(localStorage.getItem('darkmode'));
        if (this.getIsMobile()) {
            this.viewTabs = true;
            this.viewDataInsert = false;
            this.viewGroups = false;
            this.viewResult = false;


            if ('Notification' in window) {
                Notification.requestPermission(function(result) {
                    console.log('User Choice', result);
                    if (result !== 'granted') {
                        console.log('No notification permission granted!')
                    } else {

                    }
                });
            }
        }

        window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');

        //deferredPrompt Allows to show the install prompt

        window.addEventListener("beforeinstallprompt", e => {
            console.log("beforeinstallprompt fired");
            // Prevent Chrome 76 and earlier from automatically showing a prompt
            e.preventDefault();
            // Stash the event so it can be triggered later.
            this.deferredPrompt = e;

            this.installButton = true;

        });

        window.addEventListener("appinstalled", evt => {
            console.log("appinstalled fired", evt);
        });

        //autologin
        firebase.firestore().enablePersistence();
        firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);

        if (localStorage.getItem('AppInFireEmail')) {

            this.AppInFire = true;
            this.showLogin = false;
            this.fireEmail = localStorage.getItem('AppInFireEmail');
            localStorage.setItem('AppInFire', true);


            // Signed in 
            // ...
            //if its already an existing login take the data from the firestore   .doc("workplaces")
            // console.log("already have account:", this.fireEmail);
            // var docRef = db.collection(this.fireEmail).doc("workplaces");

            // docRef.get().then((doc) => {
            //     if (doc.exists) {
            //         console.log("workplaces data 23:", doc.data());
            //         localStorage.setItem('workplaces', JSON.parse(doc.data().data));

            //     } else {
            //         // doc.data() will be undefined in this case
            //         console.log("No such document!");
            //     }
            // }).then(() => {

            //     this.workplaces = JSON.parse(localStorage.getItem('workplaces'));


            // }).catch(function (error) {
            //     console.log("Error getting document:", error);
            //     localStorage.removeItem('AppInFireEmail');
            //     localStorage.removeItem('AppInFire');

            //     this.AppInFire = false;
            //     this.showLogin = true;
            //     this.fireEmail = '';
            // });
            localforage.getItem('service-worker-indexdb-updates', (err, value) => {

                if (value === true) {
                    // there is an update in from the service worker
                    localforage.setItem('service-worker-indexdb-updates', false, (err, result) => {
                        this.saveWorkPlaceFromForge();
                    });
                } else {
                    //there is no update from the service worker, check firebase
                    this.getDataFromFirebase();
                }
            });
        }

    },
    computed: {},
    methods: {
        getDataFromFirebase() {
            console.log("[getDataFromFirebase] already have account:", this.fireEmail);
            var docRef = db.collection(this.fireEmail);

            docRef.get().then((doc) => {

                console.log('[getDataFromFirebase] documents :', doc.docs);
                let tempDocsToSave = [];

                for (let element of doc.docs) {
                    let tempdocData = element.data();
                    console.log('[getDataFromFirebase] name3 :', tempdocData.name);
                    //reject the document with workplaces
                    if (tempdocData.name !== undefined && tempdocData.name.length > 1) {

                        console.log('[getDataFromFirebase] name3 after if:', tempdocData.name);
                        tempdocData.matrix = JSON.parse(tempdocData.matrix);
                        tempdocData.groupSequence = JSON.parse(tempdocData.groupSequence);
                        tempdocData.groups = JSON.parse(tempdocData.groups);

                        tempDocsToSave.push({
                            ...tempdocData
                        });
                        console.log('[getDataFromFirebase] doc data :', tempdocData);
                    } else {

                        console.log('[getDataFromFirebase] doc data move on:', tempdocData.name);
                    }
                }
                return tempDocsToSave;
            }).then((dataForLocal) => {

                //localStorage.setItem('workplaces', JSON.stringify(dataForLocal));

                localforage.setItem('workplaces', dataForLocal, function(err, result) {

                });
                this.workplaces = dataForLocal;


            });
        },
        installapp() {
            // Show the prompt
            this.deferredPrompt.prompt();

            // Wait for the user to respond to the prompt
            this.deferredPrompt.userChoice.then(choiceResult => {
                if (choiceResult.outcome === "accepted") {
                    console.log("PWA setup accepted");

                    this.installButton = false;
                } else {
                    console.log("PWA setup rejected");

                    this.installButton = false;
                }
                this.deferredPrompt = null;
            });
        },
        navigateTo(view) {
            if (this.getIsMobile()) {
                this.viewTabs = (view === 'viewTabs' ? true : false);
                this.viewDataInsert = (view === 'viewDataInsert' ? true : false);
                this.viewGroups = (view === 'viewGroups' ? true : false);
                this.viewResult = (view === 'viewResult' ? true : false);
            }
        },
        getIsMobile() {
            if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                this.isMobile = true;
                return true
            } else {
                this.isMobile = false;
                return false
            }
        },
        //firebase services
        getUrlVars() {
            var vars = {};
            var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,
                function(m, key, value) {
                    vars[key] = value;
                });
            return vars;
        },
        logout() {
            firebase.auth().signOut().then(() => {
                // Sign-out successful.
                //localStorage.setItem('workplaces', '');

                localforage.setItem('workplaces', '', function(err, result) {

                });

                localStorage.removeItem('AppInFireEmail');
                localStorage.removeItem('AppInFire');

                this.AppInFire = false;
                this.showLogin = true;
                this.fireEmail = '';

            }).catch((error) => {
                // An error happened.
                //localStorage.setItem('workplaces', '');

                localforage.setItem('workplaces', '', function(err, result) {

                });

                localStorage.removeItem('AppInFireEmail');
                localStorage.removeItem('AppInFire');

                this.AppInFire = false;
                this.showLogin = true;
                this.fireEmail = '';
            });
        },
        fireSignin() {


            var actionCodeSettings = {
                // URL you want to redirect back to. The domain (www.example.com) for this
                // URL must be in the authorized domains list in the Firebase Console.
                url: 'http://lotto.hpvk.com',
                // This must be true.
                handleCodeInApp: true,
            };
            localStorage.setItem('emailForSignIn', this.fireEmail);


            firebase.auth().sendSignInLinkToEmail(this.fireEmail, actionCodeSettings)
                .then(() => {
                    // The link was successfully sent. Inform the user.
                    // Save the email locally so you don't need to ask the user for it again
                    // if they open the link on the same device.
                    localStorage.setItem('emailForSignIn', this.fireEmail);
                })
                .catch(function(error) {
                    // Some error occurred, you can inspect the code: error.code
                    console.log(error);
                });

            alert('check your email for a login link !');
        },
        fireSigninPhone() {

            const appVerifier = window.recaptchaVerifier;
            const phoneNumberString = this.firePhone;

            firebase.auth().signInWithPhoneNumber(phoneNumberString, appVerifier)
                .then((confirmationResult) => {
                    console.log("Login success", confirmationResult);
                    window.recaptchaVerifier.clear();
                    // SMS sent. Prompt user to type the code from the message, then sign the
                    // user in with confirmationResult.confirm(code).
                    const verificationCode = window.prompt(
                        "Please enter the verification " + "code that was sent to your mobile device."
                    );

                    confirmationResult.confirm(verificationCode).then((result) => {
                        // User signed in successfully.
                        console.log('user', result.user);
                        // Clear email from storage.

                        //localStorage.removeItem('emailForSignIn');

                        // You can access the new user via result.user
                        // Additional user info profile not available via:
                        // result.additionalUserInfo.profile == null
                        // You can check if the user is new or existing:
                        // result.additionalUserInfo.isNewUser
                        // Identifier
                        this.AppInFire = true;
                        this.showLogin = false;
                        this.fireEmail = result.user.phoneNumber;
                        localStorage.setItem('AppInFire', true);


                        console.log('result', result.user.phoneNumber);

                        if (result.additionalUserInfo.isNewUser) {

                            //if this is a new user take current localstorage and add it to the firestore
                            // db.collection(result.user.email).doc('workplaces').set({
                            //         data: JSON.stringify(workplaces)
                            //     })
                            //     .then(function (docRef) {
                            //         console.log("Document written with ID: ", docRef);
                            //     })
                            //     .catch(function (error) {
                            //         console.error("Error adding document: ", error);
                            //     });

                            this.saveWorkPlace();
                            return true;

                        } else {
                            //if its already an existing login take the data from the firestore   .doc("workplaces")
                            // console.log("already have account:", result.user.email);
                            // var docRef = db.collection(result.user.email).doc("workplaces");

                            // docRef.get().then((doc) => {
                            //     if (doc.exists) {
                            //         console.log("workplaces data 434:", doc.data());
                            //         localStorage.setItem('workplaces', JSON.parse(doc.data().data));

                            //     } else {
                            //         // doc.data() will be undefined in this case
                            //         console.log("No such document!");
                            //     }
                            // }).then(() => {

                            //     this.workplaces = JSON.parse(localStorage.getItem('workplaces'));


                            // }).catch(function (error) {
                            //     console.log("Error getting document:", error);
                            // });

                            this.getDataFromFirebase();

                            return true;
                        }
                        // ...
                    }).catch(function(error) {
                        // User couldn't sign in (bad verification code?)
                        // ...
                    });
                })
                .catch((error) => {
                    console.error(error);
                    // Error; SMS not sent
                    // Handle Errors Here
                    window.recaptchaVerifier.clear();
                    return Promise.reject(error);
                });



        },
        fireRegisterWithPassword(email, password) {

            if (this.firePassword === this.fireConfirmPassword) {

                firebase.auth().createUserWithEmailAndPassword(this.fireEmail, this.firePassword)
                    .then((result) => {
                        this.AppInFire = true;
                        this.showLogin = false;
                        this.fireEmail = result.user.email;
                        localStorage.setItem('AppInFire', true);
                        localStorage.setItem('AppInFireEmail', result.user.email);


                        console.log('result', result);
                        // Signed in 
                        // ...

                        if (result.additionalUserInfo.isNewUser) {

                            //if this is a new user take current localstorage and add it to the firestore
                            // db.collection(result.user.email).doc('workplaces').set({
                            //         data: JSON.stringify(workplaces)
                            //     })
                            //     .then(function (docRef) {
                            //         console.log("Document written with ID: ", docRef);
                            //     })
                            //     .catch(function (error) {
                            //         console.error("Error adding document: ", error);
                            //     });
                            this.saveWorkPlace();

                        } else {
                            //if its already an existing login take the data from the firestore   .doc("workplaces")
                            // console.log("already have account:", result.user.email);
                            // var docRef = db.collection(result.user.email).doc("workplaces");

                            // docRef.get().then((doc) => {
                            //     if (doc.exists) {
                            //         console.log("workplaces data 53:", doc.data());
                            //         localStorage.setItem('workplaces', JSON.parse(doc.data().data));

                            //     } else {
                            //         // doc.data() will be undefined in this case
                            //         console.log("No such document!");
                            //     }
                            // }).then(() => {

                            //     this.workplaces = JSON.parse(localStorage.getItem('workplaces'));


                            // }).catch(function (error) {
                            //     console.log("Error getting document:", error);
                            // });

                            this.getDataFromFirebase();
                        }

                    })
                    .catch((error) => {
                        var errorCode = error.code;
                        var errorMessage = error.message;
                        // ..
                    });

            } else {
                alert('Passwords do not match');
            }
        },
        fireSigninWithPassword(email, password) {

            firebase.auth().signInWithEmailAndPassword(this.fireEmail, this.firePassword)
                .then((result) => {
                    this.AppInFire = true;
                    this.showLogin = false;
                    this.fireEmail = result.user.email;
                    localStorage.setItem('AppInFire', true);
                    localStorage.setItem('AppInFireEmail', result.user.email);


                    console.log('result', result);
                    // Signed in 
                    // ...
                    //if its already an existing login take the data from the firestore   .doc("workplaces")
                    // console.log("already have account:", result.user.email);
                    // var docRef = db.collection(result.user.email).doc("workplaces");

                    // docRef.get().then((doc) => {
                    //     if (doc.exists) {
                    //         console.log("workplaces data 453:", doc.data());
                    //         localStorage.setItem('workplaces', JSON.parse(doc.data().data));

                    //     } else {
                    //         // doc.data() will be undefined in this case
                    //         console.log("No such document!");
                    //     }
                    // }).then(() => {

                    //     this.workplaces = JSON.parse(localStorage.getItem('workplaces'));


                    // }).catch(function (error) {
                    //     console.log("Error getting document:", error);
                    // });


                    this.getDataFromFirebase();
                })
                .catch((error) => {
                    var errorCode = error.code;
                    var errorMessage = error.message;
                });

        },

        //app

        selectnumber(selectednumber) {

            if (this.result_group_selected_number.includes(selectednumber)) {
                //remove number
                this.result_group_selected_number = this.result_group_selected_number.filter(item => item !== selectednumber)
            } else {
                //add number
                this.result_group_selected_number.push(selectednumber);
            }
        },

        getMatrixValueWithTableFormate(row, col) {

            const value = this.getMatrixValue(row, col);

            return (value > 0 ? "<b style='color:red'>" + value + "</b>" : "<span style='color:grey'>" + value + "</span>");
        },
        getMatrixValue(row, col) {
            if (this.matrix[row] === undefined) {
                return 0;
            }
            if (this.matrix[row][col] === undefined) {
                return 0;
            }
            if (this.matrix[row][col] === null) {
                return 0;
            }

            return this.matrix[row][col];
        },
        addWorkPlace() {
            var workplaceName = prompt("Please enter a name For the Tab:", "");
            if (workplaceName == null || workplaceName == "") {
                alert("the name can not be empty !");
            } else if (this.workplaces.find(o => o.name === workplaceName)) {

                alert("Name already exist !");

            } else {

                this.workplaces.push({
                        name: workplaceName,
                        refDate: true,
                        inputData: "3	8	16	40	43	1 1	29	33	45	47	2 14	27	39	46	48	3 5	25	34	48	50	4 15	27	33	39	50	5",
                        layers: '5,5,6',
                        lengthrow: 5,
                        numberballs: 50,
                        groupsConfig: '10,20,30,40,50'
                    })
                    //localStorage.setItem('workplaces', JSON.stringify(this.workplaces));

                localforage.setItem('workplaces', this.workplaces, function(err, result) {

                });

            }
        },
        changeWorkPlace(item) {
            this.selectedWorkplace = item;


            this.selectedGroup = "";
            this.diagram = "";
            this.output = "";

            if (item.groups !== undefined) {
                //if groups where created previously, load them
                this.matrix = item.matrix;
                this.subgroups = item.groups;


            } else {

                //autogenerate the groups
                setTimeout(this.createGroups(), 5000);
            }

            this.navigateTo('viewDataInsert');

        },
        saveWorkPlaceFromForge() {
            console.log('saveWorkPlaceFromForge');


            localforage.getItem('workplaces', (err, workpls) => {

                this.workplaces = workpls;

                console.log('saveWorkPlaceFromForge', this.workplaces);
                //localStorage.setItem('workplaces', JSON.stringify(this.workplaces));

            });

            if (this.AppInFire) {
                console.log('saveWorkPlaceFromForge app in fire');


                //no longer storing to the workplaces document, it is limited

                // db.collection(this.fireEmail).doc("workplaces").set({
                //         data: JSON.stringify(localStorage.getItem('workplaces'))
                //     })
                //     .then(function (docRef) {
                //         console.log("Document written with ID: ", docRef);
                //     })
                //     .catch(function (error) {
                //         console.error("Error adding document: ", error);
                //     });

                // console.log('[saving workplaces]',JSON.parse(localStorage.getItem('workplaces')));
                let workplacedata = []; //JSON.parse(localStorage.getItem('workplaces'));

                localforage.getItem('workplaces', (err, value) => {
                    workplacedata = value


                    workplacedata.map((obj) => {

                        let tempobj = obj;
                        //nested arrays are not supported
                        tempobj.matrix = JSON.stringify(tempobj.matrix);
                        tempobj.groupSequence = JSON.stringify(tempobj.groupSequence);
                        tempobj.groups = JSON.stringify(tempobj.groups);

                        db.collection(this.fireEmail).doc(obj.name).set({
                                ...obj
                            })
                            .then(function(docRef) {
                                console.log("Document written with ID 2: ", docRef);
                            })
                            .catch(function(error) {
                                console.error("Error adding document 2: ", error);
                            });
                    });

                });


            }
        },
        saveWorkPlace() {
            var foundIndex = this.workplaces.findIndex(x => x.name == this.selectedWorkplace.name);
            this.workplaces[foundIndex] = this.selectedWorkplace;
            //localStorage.setItem('workplaces', JSON.stringify(this.workplaces));

            localforage.setItem('workplaces', this.workplaces, function(err, result) {

            });

            if (this.AppInFire) {


                //no longer storing to the workplaces document, it is limited

                // db.collection(this.fireEmail).doc("workplaces").set({
                //         data: JSON.stringify(localStorage.getItem('workplaces'))
                //     })
                //     .then(function (docRef) {
                //         console.log("Document written with ID: ", docRef);
                //     })
                //     .catch(function (error) {
                //         console.error("Error adding document: ", error);
                //     });

                // console.log('[saving workplaces]',JSON.parse(localStorage.getItem('workplaces')));
                let workplacedata = []; //JSON.parse(localStorage.getItem('workplaces'));

                localforage.getItem('workplaces', (err, value) => {
                    workplacedata = value


                    workplacedata.map((obj) => {

                        let tempobj = obj;
                        //nested arrays are not supported
                        tempobj.matrix = JSON.stringify(tempobj.matrix);
                        tempobj.groupSequence = JSON.stringify(tempobj.groupSequence);
                        tempobj.groups = JSON.stringify(tempobj.groups);

                        db.collection(this.fireEmail).doc(obj.name).set({
                                ...obj
                            })
                            .then(function(docRef) {
                                console.log("Document written with ID 2: ", docRef);
                            })
                            .catch(function(error) {
                                console.error("Error adding document 2: ", error);
                            });
                    });

                });


            }
        },
        renameWorkPlace() {
            var workplaceName = prompt("Please enter a name For the Tab:", this.selectedWorkplace.name);
            if (workplaceName == null || workplaceName == "") {
                alert("the name can not be empty !");
            } else if (this.workplaces.find(o => o.name === workplaceName)) {

                alert("Name already exist !");

            } else {

                var foundIndex = this.workplaces.findIndex(x => x.name == this.selectedWorkplace.name);
                this.workplaces[foundIndex].name = workplaceName;
                //localStorage.setItem('workplaces', JSON.stringify(this.workplaces));

                localforage.setItem('workplaces', this.workplaces, function(err, result) {

                });
            }


            this.saveWorkPlace();
        },
        removeWorkPlace() {
            if (confirm("Are you sure you want to delete this workplace")) {
                let txt = "You pressed OK!";
                if (this.workplaces.length === 1) {
                    alert("You can not remove the last workplace !");
                } else {
                    var filteredWorkplaces = this.workplaces.filter(x => x.name !== this.selectedWorkplace.name);
                    this.workplaces = filteredWorkplaces;
                    //localStorage.setItem('workplaces', JSON.stringify(this.workplaces));

                    localforage.setItem('workplaces', this.workplaces, function(err, result) {

                    });
                }
            } else {
                txt = "You pressed Cancel!";
            }
        },
        duplicateWorkPlace() {

            var workplaceName = prompt("Please enter a name For the duplicate Tab:", this.selectedWorkplace.name);
            if (workplaceName == null || workplaceName == "") {
                alert("the name can not be empty !");
            } else if (this.workplaces.find(o => o.name === workplaceName)) {

                alert("Name already exist !");

            } else {
                //find the index for the current selected
                var tempWorkplace = JSON.parse(JSON.stringify(this.selectedWorkplace));
                tempWorkplace.name = workplaceName;
                this.workplaces.push(tempWorkplace);
                //localStorage.setItem('workplaces', JSON.stringify(this.workplaces));

                //update the localstorage
                localforage.setItem('workplaces', this.workplaces, (err, result) => {
                    if (result) {
                        this.saveWorkPlace();
                    }
                });
            }

        },


        //https://stackoverflow.com/questions/39927452/recursively-print-all-permutations-of-a-string-javascript
        permut(string) {
            if (string.length < 2) return string; // This is our break condition

            var permutations = []; // This array will hold our permutations

            for (var i = 0; i < string.length; i++) {
                var char = string[i];

                // Cause we don't want any duplicates:
                if (string.indexOf(char) != i) // if char was used already
                    continue; // skip it this time

                var remainingString = string.slice(0, i) + string.slice(i + 1, string.length); //Note: you can concat Strings via '+' in JS

                for (var subPermutation of permut(remainingString))
                    permutations.push(char + subPermutation)

            }
            return permutations;
        },
        clean(s) {
            let r = s.replace(/\D/g, ' ');
            r = r.replace(/\s\s+/g, ' ');
            return r;
        },
        zpadlen(n, len) {
            return ("00000" + n).slice(-len);
        },
        zpad(n) {
            return ("0000" + n).slice(-4);
        },
        zpad2(n) {
            return ("0000" + n).slice(-2);
        },
        zpad3(n) {
            return ("0000" + n).slice(-3);
        },
        zpad4(n) {
            return ("0000" + n).slice(-4);
        },
        sumstr(s) {
            r = 0;
            for (i = 0; i < s.length; i++) {
                r += parseInt(s[i]);
            }
            return r;
        },
        rootstr(s) {
            n = parseInt(s);
            while (n > 9) {
                n = sumstr(n + "") + "";
                n = parseInt(n);
            }
            return n;
        },
        tablerow(row) {
            r = "<tr>"
            for (i = 0; i < row.length; i++) {
                r += "<td align='center'>" + row[i] + "</td>"
            }
            r += "</tr>";
            return r;
        },
        addstr(s1, s2) {
            r = "";
            for (i = 0; i < s1.length; i++) {
                r += "" + ((parseInt(s1[i]) + parseInt(s2[i])) % 10);
            }
            return r;
        },
        subarr(a1, a2) {
            r = [];
            for (i = 0; i < a1.length; i++) {
                r.push(parseInt(a1[i]) - parseInt(a2[i]));
            }
            return r;
        },
        addarr(a1, a2) {
            r = [];
            for (i = 0; i < a1.length; i++) {
                r.push(parseInt(a1[i]) + parseInt(a2[i]));
            }
            return r;
        },
        bracket_if_match(str, n) {
            r = [];
            for (var i = 0; i < str.length; i++) {
                if (parseInt(str[i]) == parseInt(n)) {
                    r.push("(" + str[i] + ")");
                } else {
                    r.push(str[i]);
                }
            }
            return r;
        },
        mirror(n) {
            n = "" + n;
            r = "";
            for (var i = 0; i < n.length; i++) {
                r += ((parseInt(n[i]) + 5) % 10) + "";
            }
            return r;
        },
        mirrorarr(ar) {
            var r = [];
            for (var i = 0; i < ar.length; i++) {
                r.push(mirror(ar[i]));
            }
            return r;
        },
        intarr(ar) {
            var re = [];
            for (var i = 0; i < ar.length; i++) {
                re.push(parseInt(ar[i]));
            }
            return re;
        },
        lotmat(ar) {
            re = 0;
            for (i = 0; i < ar.length; i++) {
                re += parseInt(ar[i]);
            }
            re = re % 10;
            return re;
        },



        createnetwork() {
            hidlayers = eval("[" + this.selectedWorkplace.layers + "]");
            this.net = new brain.NeuralNetwork({
                hiddenLayers: hidlayers
            });
            outputt = "Neural Net created with Hidden Layers Shape [" + hidlayers.join(",") + "]<br/>";
            this.output = outputt;

        },
        reverseInputLines() {
            input = this.selectedWorkplace.inputData;
            input = input.split("\n");
            input = input.reverse();
            input = input.join("\n");
            this.selectedWorkplace.inputData = input;
        },

        highestProb(result, print = 1) {
            orderlst = [];
            for (var i = 0; i < result.length; i++) {
                orderlst.push([i + 1, result[i]]);
            }
            orderlst = orderlst.sort(function(a, b) {
                return b[1] - a[1]
            });
            lst = [];
            if (print == 1) {
                this.output += "Highest probability is: " + orderlst[0][1] + "<br/>";
                this.output += "Lowest probability is: " + orderlst[orderlst.length - 1][1] + "<br/>";
            }
            for (var i = 0; i < orderlst.length; i++) {
                lst.push(orderlst[i][0]);
            }
            return lst;
        },
        runapp() {
            this.loading = true;

            //give time to load the loading animation
            setTimeout(() => {

                this.trainnetwork();

            }, 500); //one sec
        },
        trainnetwork() {
            //for (var i=0;i<1;i++){

            //give time to load the loading animation

            stats = this.net.train(this.tD);
            this.output = "Error:" + stats["error"] + " Iterations: " + stats['iterations'];
            this.output += "<br/>Trained.<br/>Run with last Draw result: " + this.lastDraw.join(", ") + "<br/>";

            this.diagram = brain.utilities.toSVG(this.net)
            this.runthrough();

        },

        runthrough() {
            lengthrow = +this.selectedWorkplace.lengthrow;
            result = this.net.run(this.lastResult);
            ordlst = this.highestProb(result);
            numbersToPlay = ordlst.slice(0, lengthrow);

            this.result_group_numbersToPlay = numbersToPlay;
            this.output += "From most likely to least likely: " + ordlst.join(', ') + "<br/>";
            //this.output += "Numbers to play: <b>" + numbersToPlay.join(' ') + "</b><br/>";
            this.output += "Numbers to play: <b>";

            for (let [index, val] of numbersToPlay.entries()) {
                this.output += "<span class='table-number-to-play'>" + val + "</span>";
            }

            this.output += "</b><br/>";


            this.output += "Here are 10 sets ran in series:<br/>";
            nextResult = this.lastResult;
            balls = ordlst.length;
            numbers = numbersToPlay.length;


            this.output += "<table class='table' style='background-color: white; margin-top: 20px;'><tbody>";
            for (var i = 0; i < lengthrow; i++) {
                result = this.net.run(nextResult);
                ordlst = this.highestProb(result, print = 0);
                thisSet = ordlst.slice(0, numbers);

                // this.output += "<b>"+thisSet.join(" ")+"</b><br/>";
                // nextResult = this.tD_Ones(balls,thisSet);

                this.output += "<tr>";
                for (let [index, val] of thisSet.entries()) {
                    this.output += "<td>" + val + "</td>";
                }
                this.output += "</tr>";
                nextResult = this.tD_Ones(balls, thisSet);
            }

            this.output += "</tbody></table>";

            this.loading = false;

        },
        trainnetwork100() {
            for (var i = 0; i < 100; i++) {
                this.net.train(this.tD);

            }
            this.output = "<br/>Trained 100x.<br/>Run with last Draw result: " + this.lastDraw.join(", ") + "<br/>";
            this.runthrough();
        },
        trainnetwork1000() {
            for (var i = 0; i < 1000; i++) {
                this.net.train(this.tD);

            }
            this.output = "<br/>Trained 1000x.<br/>Run with last Draw result: " + this.lastDraw.join(", ") + "<br/>";
            this.runthrough();
        },
        readtrainingdata() {
            this.run();
        },
        tD_Ones(size, row) {
            var res = [];
            for (var i = 0; i < size; i++) {
                res.push(0);
            }
            for (var i = 0; i < row.length; i++) {
                curindex = parseInt(row[i]) - 1;
                res[curindex] = 1;
            }
            return res;
        },

        changeResultGroup(name, values) {

            this.selectedGroup = name;

            this.result_group = values.winning;

            this.result_group_winning = values.winning.join(" ");
            this.result_group_winningAndRef = values.winningAndRef;
            this.result_group_refs = values.refs;
            this.result_group_numbers = values.numbers;

            console.log('change group values', values);
            if (values.output !== undefined) {
                setTimeout(() => {
                    console.log('change group values', values.output);
                    this.diagram = values.diagram;
                    this.output = values.output;
                    this.result_group_numbersToPlay = values.result_group_numbersToPlay;

                }, 300);
            } else {

                this.result_group_numbersToPlay = [];

            }
        },

        generateProportionTable() {},

        generateProportionMatrix(winningRow) {


            let lengthrow = +this.selectedWorkplace.lengthrow;
            for (var m = 0; m < lengthrow; m++) {

                if (this.matrix[winningRow[m]] === undefined) {
                    this.matrix[winningRow[m]] = [];

                }
                if (this.matrix[winningRow[m]][m] === undefined) {
                    this.matrix[winningRow[m]][m] = 1;
                } else {
                    this.matrix[winningRow[m]][m] += 1;
                }
            }
        },

        createGroups() {
            this.navigateTo('viewGroups');
            //reset default values
            this.matrix = [];
            this.result_group = "";
            this.result_group_winning = "";
            this.result_group_winningAndRef = "";
            this.result_group_refs = "";
            this.result_group_numbers = [];
            this.result_group_numbersToPlay = [];

            this.saveWorkPlace();

            //clear previous groups
            this.subgroups = {
                'All': {
                    winning: [],
                    winningAndRef: [],
                    refs: [],
                    numbers: []
                }
            };

            // put them in groups of 6 for each item
            //create rows here
            let check = this.selectedWorkplace.inputData;
            check = this.clean(check);
            let checks = check.split(" ");
            var filtered = checks.filter(function(el) { //filter out empty
                return el != "";
            });
            let inputs = filtered;
            let lengthrow = +this.selectedWorkplace.lengthrow;

            //group sequence is used to predict the next group
            let groupSequence = [];


            for (var i = 0; i < (Math.floor(inputs.length / (lengthrow + (this.selectedWorkplace.refDate ? 1 : 0)))); i++) {

                let input = [];
                let inputWithRef = [];
                let ref = null;
                let inputRef = null;

                //use last column as date ref column filter out the other numbers as winnings
                if (i === 0 || this.selectedWorkplace.refDate === false) {
                    input = inputs.slice(i * lengthrow, i * lengthrow + lengthrow);
                    this.generateProportionMatrix(input);
                } else {
                    input = inputs.slice(i * (lengthrow + 1), i * (lengthrow + 1) + (lengthrow));
                    this.generateProportionMatrix(input);
                }
                //input = inputs.slice(i*lengthrow,i*lengthrow+lengthrow);

                if (this.selectedWorkplace.refDate === true) {
                    inputWithRef = inputs.slice(i * (lengthrow + 1), i * (lengthrow + 1) + (lengthrow + 1));
                    ref = inputs[i * lengthrow + (lengthrow + i)];

                } else {
                    inputWithRef = inputs.slice(i * lengthrow, i * lengthrow + lengthrow);
                    ref = i;
                }

                //get the ref column
                if (this.selectedWorkplace.refDate === true) {
                    inputRef = inputs[i * lengthrow];
                }


                var groupsConfig1 = this.selectedWorkplace.groupsConfig;
                var groupsConfig = groupsConfig1.split(",");

                let groupNumbers = [];

                let subname = [];
                //for (var j=0;j<lengthrow;j++){
                for (var j = 0; j < groupsConfig.length; j++) {
                    subname.push(0)
                }


                input.forEach(element => {

                    let triggered = false;
                    groupNumbers.push(element);

                    for (let [index, val] of groupsConfig.entries()) {
                        if (triggered === false) {
                            if (+element <= +val) {
                                subname[+index] += 1;
                                triggered = true;
                            }
                        }
                    }
                    // if(element < 10){
                    //     subname[0] += 1;
                    // }else if(element < 20){
                    //     subname[1] += 1;
                    // }else if(element < 30){
                    //     subname[2] += 1;
                    // }else if(element < 40){
                    //     subname[3] += 1;
                    // }else if(element <= 50){
                    //     subname[4] += 1;
                    // }

                });


                groupSequence.push(subname);
                subname = subname.join("-");
                if (this.subgroups[subname] === undefined) {
                    this.subgroups[subname] = {};
                    this.subgroups[subname].name = '';
                    this.subgroups[subname].winning = [];
                    this.subgroups[subname].winningAndRef = [];
                    this.subgroups[subname].refs = [];
                    this.subgroups[subname].numbers = [];
                }
                this.subgroups[subname].name = subname;
                this.subgroups[subname].winning.push(input);
                this.subgroups[subname].winningAndRef.push(inputWithRef.join(" "));
                this.subgroups[subname].refs.push(ref);
                this.subgroups[subname].numbers = [...this.subgroups[subname]['numbers'], ...groupNumbers];
                this.groupKeys.push(subname);



                this.subgroups.All.name = 'All';
                this.subgroups.All.winning.push(input);
                this.subgroups.All.winningAndRef.push(inputWithRef.join(" "));
                this.subgroups.All.refs.push(ref);
                this.subgroups.All.numbers = [...this.subgroups.All.numbers, ...groupNumbers];


            }


            //save groups to localstorage
            this.selectedWorkplace.groups = this.subgroups;
            this.selectedWorkplace.groupSequence = groupSequence;

            if (this.selectedWorkplace.predictnextgroup) {
                this.startpredictNextGroup();

            }

            this.saveWorkPlace();

            console.log('subgroups', this.subgroups);
            //this.result_group_winning =this.groupKeys.join(" ");
        },
        startpredictNextGroup() {
            this.loadinggroups = true;
            this.selectedWorkplace.nextGroupResult = '';

            setTimeout(() => {

                this.predictNextGroup();

            }, 500); //one sec

        },
        sendMessage(message) {
            // This wraps the message posting/response in a promise, which will
            // resolve if the response doesn't contain an error, and reject with
            // the error if it does. If you'd prefer, it's possible to call
            // controller.postMessage() and set up the onmessage handler
            // independently of a promise, but this is a convenient wrapper.
            return new Promise((resolve, reject) => {
                //   var messageChannel = new MessageChannel();

                navigator.serviceWorker.onmessage = (event) => {
                    if (event.data.error) {
                        console.log('message back error', event.data.error)
                        reject(event.data.error);
                    } else {
                        console.log('message back resolve', event.data)
                        resolve(event.data);
                    }
                };

                //   alternative
                //   navigator.serviceWorker.onmessage = function (e) {
                //     // messages from service worker.
                //     console.log('e.data', e.data);

                // This sends the message data as well as transferring
                // messageChannel.port2 to the service worker.
                // The service worker can then use the transferred port to reply
                // via postMessage(), which will in turn trigger the onmessage
                // handler on messageChannel.port1.
                // See
                // https://html.spec.whatwg.org/multipage/workers.html#dom-worker-postmessage
                //navigator.serviceWorker.controller.postMessage(message, [messageChannel.port2]);

                navigator.serviceWorker.controller.postMessage(message, {
                    type: message.type,
                    length: message.length,
                    groupSequence: message.groupSequence,
                    tabName: message.tabName
                });
            });
        },

        predictNextGroup() {

            this.sendMessage({
                type: 'PREDICT_NEXT_GROUP',
                length: this.selectedWorkplace.groupSequence[0].length,
                groupSequence: this.selectedWorkplace.groupSequence,
                selectedWorkplace: this.selectedWorkplace,
                tabName: 'temp'
            }).then((output) => {

                console.log('predict next group then', output);
                this.saveWorkPlaceFromForge();
                this.loadinggroups = false;

                //set a flag to let the app know if its been remounted that it needs to save the data
                localforage.setItem('service-worker-indexdb-updates', false, function(err, result) {});
            });


        },
        run() {
            outputt = "";
            //check these numbers in 'check' element
            //lastdraw =  .getElementById('draw').value;
            check = this.result_group_winning;
            check = this.clean(check);
            checks = check.split(" ");
            var filtered = checks.filter(function(el) { //filter out empty
                return el != "";
            });
            checks = filtered;


            inputs = checks;

            //get row length
            lengthrow = +this.selectedWorkplace.lengthrow;


            //len = inputs[0].length; //Pick-3/Pick-4 indicator based on len.
            len = lengthrow;

            // put them in groups of 6 for each item
            //create rows here
            finputs = [];
            for (var i = 0; i < (Math.floor(inputs.length / lengthrow)); i++) {

                //use last column as date ref column filter out the other numbers as winnings
                input = inputs.slice(i * lengthrow, i * lengthrow + lengthrow);
                finputs.push(input);

            }
            inputs = finputs;

            //inputs = inputs.reverse(); //reverse so that it's from oldest to newest
            balls = this.selectedWorkplace.numberballs;

            this.tD = [];
            for (var i = 0; i < inputs.length - 1; i++) {
                tDin = this.tD_Ones(balls, inputs[i].slice(0, len));
                tDout = this.tD_Ones(balls, inputs[i + 1].slice(0, len));
                this.tD.push({
                    input: tDin,
                    output: tDout
                });
            }
            this.lastDraw = inputs[inputs.length - 1];
            console.log('[lastDraw]', inputs);
            this.lastResult = this.tD_Ones(balls, this.lastDraw.slice(0, len));
            outputt += "Read training data!";

            this.output = outputt;


        }



    },
    watch: {
        darkmode: function(val) {

            localStorage.setItem('darkmode', val);
            if (val) {
                document.documentElement.setAttribute('data-theme', 'dark');
            } else {
                document.documentElement.setAttribute('data-theme', 'light');
            }
        },
        output: function(val) {

            //save groups to localstorage
            //console.log('selectedGroup',this.selectedGroup);
            if (val) {

                this.selectedWorkplace.groups[this.selectedGroup].output = this.output;
                this.saveWorkPlace();
            }
        },
        matrix: function(val) {

            //save matrix inside groups in localstorage
            //console.log('matrix',val);

            if (val) {

                this.selectedWorkplace.matrix = this.matrix;
                this.saveWorkPlace();
            }
        },
        diagram: function(val) {

            //save diagram inside groups to localstorage
            //console.log('diagram',this.diagram);

            if (val) {

                this.selectedWorkplace.groups[this.selectedGroup].diagram = this.diagram;
                this.saveWorkPlace();
            }
        },
        result_group_numbersToPlay: function(val) {

            //save diagram inside groups to localstorage
            //console.log('diagram',this.diagram);

            if (val && this.selectedGroup) {

                this.selectedWorkplace.groups[this.selectedGroup].result_group_numbersToPlay = val;
                this.saveWorkPlace();
            }
        }
    }
})