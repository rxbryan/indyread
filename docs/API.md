### IndyRead API

**Description:**
This API provides endpoints for querying the indy ledger.

**Endpoints:**
* **GET /api/networks**
    * **Description:** Retrieve the networks supported by the running instance of indyread.
    * **Response:**
        * **JSON:**
            ```json
                [
                  {
                    "id": "TEST_NETWORK",
                    "ui": {
                      "priority": 1,
                      "display": "TEST_NETWORK",
                      "display-long": "",
                      "description": "For active development of indyread.",
                      "tutorial": "Get your DID and start writing on the network",
                      "tutorial-link": "",
                      "logo-address": ""
                    },
                    "aliases": [
                      ""
                    ],
                    "es": {
                      "index": "txs-bcovdev"
                    }
                  }
                ]
            ```

### Read Requests

#### GET_TXN

* **GET /api/networks/:networkRef/txs/:seqNo**
    * **Description:** Retrieve a transaction by id or seqno.
    * **Request Parameters:**
        * `networkRef`: network id.
        * `seqNo`: `data` (int): Requested transaction sequence number (seqNo) as it’s stored on Ledger.
    * **Request Query:**
        * `ledgerId` (int enum, required): ID of the ledger the requested transaction belongs to (Pool=0; Domain=1; Config=2).
        * `reqId`: (required)
        * `identifier`: (required)
    * **Examples:**
        ```sh
          curl http://0.0.0.0:3708/api/networks/TEST_NETWORK/txs/100?ledgerId=1&reqId=1514311352551755&identifier=MSjKTWkPLtYoPEaTF1TUDb
        ```
    * **Response:**
        * **JSON:**
            ```json
                {
                  "op": "REPLY",
                  "result": {
                    "type": 3,
                    "identifier": "MSjKTWkPLtYoPEaTF1TUDb",
                    "reqId": "1514311352551755",
                    "seqNo": 100,
                    "data": {
                      "ver": 1,
                      "txn": {
                        "data": {
                          "dest": "L5ak5y4ctDEqyHJsnRZMJL",
                          "raw": "{\"endpoint\":{\"endpoint\":\"http://10.1.0.12:8020\",\"routingKeys\":[]}}"
                        },
                        "metadata": {
                          "digest": "bed4b26e608fa866ace669cc18cf79e3b5ff29abe5992cbc57d9088447ff8fe5",
                          "from": "L5ak5y4ctDEqyHJsnRZMJL",
                          "payloadDigest": "aa3839b914ad6800e1dbe22737b114960e3534577892c0d3c7270a40791ec554",
                          "reqId": "1514311352551755"
                        },
                        "protocolVersion": 2,
                        "type": "100"
                      },
                      "txnMetadata": {
                        "seqNo": 100,
                        "txnId": "L5ak5y4ctDEqyHJsnRZMJL:1:b6bf7bc8d96f3ea9d132c83b3da8e7760e420138485657372db4d6a981d3fd9e",
                        "txnTime": 1690575694
                      },
                      "reqSignature": {
                        "type": "ED25519",
                        "values": [
                          {
                            "from": "L5ak5y4ctDEqyHJsnRZMJL",
                            "value": "5KNS3gCwvbdP5yaiMpsWSTKFSwRD7ZKyGHoe7TwtyFuCVAxAeFHrf1r7TfoymjtUSnh9Ykq9u8yKRFYkjLTKwYvR"
                          }
                        ]
                      },
                      "rootHash": "8HZx81ehri6fggMnqGEUUJMmAonfj4XKKg5kyNPPmt5H",
                      "auditPath": [
                        "7U19YUEjKB7fzvLZyuF1vqGAfr3dUg8cHVvmZFc2wmnA",
                        "3DtZb67YPv8Man8kHCj4M8PWXFDn2WEpnSJPNBZWgGbW",
                        "ByrpoQo2bYCUs1x8EwWfKBvnY74FW85eTexYN56WVM6R",
                        "4U4dWZhU4hKedrvs3EJuLQXsQyoBTYo6TbbUqbTMofTK",
                        "H2todTrd6uQdi9o9UEr41fnXueRvahquNMQxSatfubn1",
                        "FBBFf4oP7UJgP5bEoDVB4tuULEJHubjS2fnfM3ivuev3",
                        "BAMh6dZwJov2VUVMeuo4As4QU2eH98EdomrAwUaAfKwr",
                        "B5yx8ExTWjkgaDHuYWbosaoPhuq15uBx1jmp6npp6cKa",
                        "41vHGCg6qKUEtLAveyeWLMNdhZoH89Ym6xymFvSj64ER",
                        "APznt6o24yBWCNs5tVF4fC6h6rMz1Joj9BYWQuXJH1V5",
                        "3EByMrinqTxqaC7VEnQj4bKn29Gg357MoaTJxhZJvAbv",
                        "CV3xU14oTyGxemt6ZzLGhcBoTEcQ9MivEgo4fREPJbax",
                        "9MvXyCYNaPnTWV5ZW6E8hkPnjEurmTGmzTTUJJ9sGZ3L",
                        "8cPhRmSsSLKQjVGdSLcfQT12FdmPVct96ruLzuDzMjUZ",
                        "Cc3VieL5aXKyLLqt97PCrC3zoPU2F6wJddDZMhicCGSk",
                        "Cbs8mFThL3uUoZNPNJLrzSozYMp1mGPe5z2SuNwFdRUR",
                        "5QxygKhC5siMNd3geLBrXcdib341CRTpEFU3wicA6GM7",
                        "2kqdayLhGFcDwDizS7Tr4tU7zFQmAAoE7HQjwDsXuYa1",
                        "CmvdWARcru6SGgnCjjSvg6cLRwdTAixw2L1KwqHSEXUA",
                        "5PevtFLM7muNh9FWdWkkdkXngFQszy6br2kicPkghSC2",
                        "DuQMEgUHvqEpBqUj9shiiyn64u3hUu6qe5MCfHJHcpVC"
                      ]
                    }
                  }
                }
            ```

#### GET_NYM¶

* **GET /api/networks/:networkRef/txs/nym/:dest**
    * **Description:** searches the ledger for a nym/did transaction.
    * **Request Parameters:**
        * `networkRef`: network id.
        * `ledger`: `domain` `pool` `config`.
        * `dest`: nym to search for.
    * **Request query:**
        * `timestamp`: timestamp' is mutually exclusive with 'seqNo'
        * `seqNo`: transaction id. seqNo' is mutually exclusive with 'timestamp'
        * `reqId`: (required)
        * `identifier`: (required)
    * **Example**
        ```sh
        curl http://0.0.0.0:3708/api/networks/TEST_NETWORK/txs/nym/YT1mzd8om41njS7VuoAwZ4/?reqId=1514311352551755&identifier=MSjKTWkPLtYoPEaTF1TUDb
        ```
    * **Response:**
        * **JSON:**
            ```json
              [
                {
                  "op": "REPLY",
                  "result": {
                    "type": "105",
                    "identifier": "MSjKTWkPLtYoPEaTF1TUDb",
                    "reqId": "1514311352551755",
                    "seqNo": 14,
                    "txnTime": 1690575212
                  },
                  "data": {
                    "alias": "Bob.agent",
                    "dest": "YT1mzd8om41njS7VuoAwZ4",
                    "role": "101",
                    "verkey": "J99fCbX5wdrohpXmDiRDqJ5psje3MGD2hgEQgoGuy8hV",
                    "identifier": "MSjKTWkPLtYoPEaTF1TUDb",
                    "txnTime": 1690575212,
                    "seqNo": 14
                  },
                  "dest": "YT1mzd8om41njS7VuoAwZ4"
                }
              ]
            ```

#### GET_ATTRIB
* **GET /api/networks/:networkRef/txs/attrib/:dest**
    * **Description:** searches the ledger for a nym/did transaction.
    * **Request Parameters:**
        * `networkRef`: network id.
        * `dest`: nym to search for.
    * **Request query:**
        * `timestamp`: timestamp' is mutually exclusive with 'seqNo'.
        * `seqNo`: transaction id. seqNo' is mutually exclusive with 'timestamp'.
        * `raw`: *base64 encoded* Requested attribute name.
        * `reqId`: (required)
        * `identifier`: (required)
    * **Example**
        ```sh
        curl http://0.0.0.0:3708/api/networks/TEST_NETWORK/txs/attrib/RxFcjTjL6jPdn5EEJkNfqt?timestamp=1690575762&raw=eyJlbmRwb2ludCI6eyJlbmRwb2ludCI6Imh0dHA6Ly8xMC4xLjAuMTI6ODA0MCIsInJvdXRpbmdLZXlzIjpbXX19&reqId=1514311352551755&identifier=MSjKTWkPLtYoPEaTF1TUDb
        ```
    * **Response:**
        * **JSON:**
            ```json
              [
                {
                  "op": "REPLY",
                  "result": {
                    "type": "104",
                    "identifier": "MSjKTWkPLtYoPEaTF1TUDb",
                    "reqId": "1514311352551755",
                    "seqNo": 109,
                    "txnTime": 1690575762
                  },
                  "data": "{\"endpoint\":{\"endpoint\":\"http://10.1.0.12:8040\",\"routingKeys\":[]}}",
                  "dest": "RxFcjTjL6jPdn5EEJkNfqt",
                  "raw": "endpoint"
                }
              ]
            ```



#### GET_SCHEMA
* **GET /api/networks/:networkRef/txs/schema/:from**
    * **Description:** searches the ledger for a nym/did transaction.
    * **Request Parameters:**
        * `networkRef`: network id.
        * `from`: from DID.
    * **Request query:**
        * `name`: Schema’s name string.
        * `version`: Schema’s version string.
        * `reqId`: (required)
        * `identifier`: (required)
    * **Example**
        ```sh
        curl http://0.0.0.0:3708/api/networks/TEST_NETWORK/txs/schema/AywStqzmPHG9uHfmL9e5AH?reqId=1514311352551755&identifier=MSjKTWkPLtYoPEaTF1TUDb&name=Schema_DriversLicense&version=1.0.1
        ```
    * **Response:**
        * **JSON:**
            ```json
              {
                "op": "REPLY",
                "result": {
                  "type": "107",
                  "identifier": "MSjKTWkPLtYoPEaTF1TUDb",
                  "reqId": "1514311352551755",
                  "seqNo": 44,
                  "txnTime": 1690575358,
                  "state_proof": {

                  }
                },
                "data": {
                  "attr_names": [
                    "age",
                    "expiry",
                    "DL_number",
                    "address",
                    "id"
                  ],
                  "name": "Schema_DriversLicense",
                  "version": "1.0.1"
                },
                "dest": "AywStqzmPHG9uHfmL9e5AH"
              }
            ```

#### GET_CLAIM_DEF
* **GET /api/networks/:networkRef/txs/claim-def/:origin**
    * **Description:** searches the ledger for a nym/did transaction.
    * **Request Parameters:**
        * `networkRef`: network id.
        * `origin`: Claim Definition Issuer’s DID. from DID.
    * **Request query:**
        * `ref`: (required) Sequence number of a Schema transaction the claim definition is created for.
        * `signature_type`:(required) "CL" is the only supported claim signature type.
        * `tag`: (required)
        * `reqId`: (required)
        * `identifier`: (required)
    * **Example**
        ```sh
          curl http://0.0.0.0:3708/api/networks/TEST_NETWORK/txs/claim-def/AywStqzmPHG9uHfmL9e5AH?reqId=1514311352551755&identifier=MSjKTWkPLtYoPEaTF1TUDb&ref=44&signature_type=CL&tag=Acme.agent.Schema_DriversLicense
        ```
    * **Response:**
        * **JSON:**
            ```json
                {
                  "op": "REPLY",
                  "result": {
                    "type": "108",
                    "identifier": "MSjKTWkPLtYoPEaTF1TUDb",
                    "reqId": "1514311352551755",
                    "seqNo": 45,
                    "txnTime": 1690575367,
                    "state_proof": {

                    }
                  },
                  "data": {
                    "primary": {
                      "n": "110031718099176256339990301904652142724202499492728455079410358771748511210757787507577557531538715537306512545826846373642997643869580216542477594319108510407817323868131956140777471402719213802979993839468688477952799405436000906145793289230875753293359632338205101663908262446722466318874788022390231593910742131427257612628430323645681201553674489522783145231216953702810844234477107803074022287266891187257357887906200867501169106245342989365465835914905241437389852564081084358150942133578924670433628573878600160575673311646295027014157427684456035205354339559672871394566980011664115747456594912463713287958881",
                      "r": {
                        "address": "90246057543625063103317526925392575871655128978827305059617276602842054428451982681165277840409534869468372043509293892441233155138111306506364277837144102309529868428914905670035976013386091959952485887853347863857865803009313251972735588844231540381490591253660221823145699171147855371933090612072850538364794714323482977805453966477077906139911683973883233625377804789735760919416526242711150362302261258599293282484117376221320592332061034514933370519656245281260270747461932711132535425577547484028897408590506691686663101429819086881807252843854295514539870450367011317829050788442954867347180692058866407015620",
                        "age": "40657416214686575518328760813488971015955925918013283775505587375154484152585858418794218070553121751097770624565891706906863873762482844542696557908286560956321179716302063655203469456778276829404283028236780885411576117481311527130525004100879256837069822064991960573519688792698718565630001675927962561614719877626951113970878687031651561738458073130262178234088051043734946607000865640967127542269812226201254423460955829617202836547611650068372163633042867869683714773205669359932532689927491502133399787102589753428635756334843930983098257109538829898321776389951086810663495823473798230933025840964291789885553",
                        "dl_number": "70838215304717200679165320840768461119700941496016053979297737155047421787134990312771658011705869103381474104234612923387179823354868628922527206662535382169936951826018942297617105107881302493722026365193001815949506591994827341898834112015118110330594533381811550998210750001567542648498832377905720390001862059618114988125822888739364312883802932790127481469554757196286392990540999511037230388920515046383268659988829029784439357958863886377643165309598927100358434516882755767436142237964267765331666157997340890906860092597318454347295556544620712647142133418394801412828740736946325944335294348300849337232116",
                        "expiry": "14051855612990013788605732485928675588492597993102737343317993803468620974485009375392379924927470395079451135789691466311741023126023993510835054476924255224338002313537335494672977875097224309420119533042560525237020923803191661937468225106238299876318086902474722849533055825050734610568119139188785216076205767033149804230842952215486660759454846088222387441185821829574624700895302163111204251914837948247803875980711639200477402402501178000226159649911223595117562837833863317020243540228111282013997201032987432248005449240329938463055091438834679939661057515915305033959603540642108665325011289931665733605306",
                        "id": "29148539453721993929433612737913287171583129083326922337699785438956122998784303582298865711636085074407898870410750093253107743300114738262213248106151984230227636356384912758365527700126362532917031186316633811121525717038127292677619474457767407131389950258908704789619808345494348181988465498425225326842552970490181663542834497861010383822690480677541778587245610050607769199339005313798453934417321678442109869216040411889648001525786917215451611262721381684784100711846450270287334520319854511938564375959295453798736183928451818587248756477911797554116231827355671545957319364450441518021511691602722971093429",
                        "master_secret": "93527594026070838868176374917012573459757662113459178563478558592323189935813369811989960359751845099456607556823228485561482861366300782120410027112903161075112951240523287007136564646673883965819037457342193342598038858542671399331900514937964987149771849141316946545902687021894483559173020342674195861813664803224495918893285074547278835094195580209102335608259329852833579952162016593234466713953792152668653729896003910937518913468000337633577222499164587277244036652425768292482815192578923672981198335987200187808227750226636587421899753570222115618239840578094970218233003724124783147942443457533983960410755"
                      },
                      "rctxt": "66521390294765337327667975985021544547771184869889097416366651088143448227921269444188621758448964008532631588827264726475596278397156730725758541638460040389805050892946969816377139658553846223853426980017325669411879441060096220109954336739747013740061250420634457696267966285146625428812740924227545248847807387059466446672577862622690693450219568977123659068880916256560456241531256328537104877048987467558710209500162091474360640967745665588340013964490515321262090916886981043252353513745138710764370689965522156176212188150729584877460202736099215427777491770166959867855642788990995914892096506007303040076270",
                      "s": "51708991722915652416813078906466153234081932279622533768404677446935671834664752528439540174202536624570212860216589989340319005019884229433181130920032146056029820633482838113774679430509306517781352651755874188030922397324471438524634636437710927859944550639846419354266739887184744143875081775675533741104995082019394184110394516495162072786787513972298135797968637758349858243347417895824711586588386391341903305403041672282309398898781218610042189279317365581763024848071173759833199713348224894174214397708420436844383044221310549942900687214435015580385466444697231634248913882749796615445597203831460439524430",
                      "z": "37286145451861108394571802838067332611783906392068252922467268638470599945726807048934716549760229820751588713160630026618715986852085777063176597329620815143234845899320676021159414388316538962741434635699893964634274843772989801155462030853203279857811537553386822941858480908286566229379308798359092258987265613338112191583255023402562504715394489911401713281544609242965689078190315107532895723857954537072015143250171788993459303711220186799460283609025406312831192713837895434006710540969954221937476084178461142617596342499923495518646658976333878601624453295593296142965458967754895803001262378381428020044136"
                    }
                  },
                  "signature_type": "CL",
                  "origin": "AywStqzmPHG9uHfmL9e5AH",
                  "ref": "44",
                  "tag": "Acme.agent.Schema_DriversLicense"
                }
            ```

#### GET_REVOC REG_DEF
* **GET /api/networks/:networkRef/txs/revoc-reg-def/:id**
    * **Description:** searches the ledger for a nym/did transaction.
    * **Request Parameters:**
        * `networkRef`: network id.
        * `id`: Revocation Registry Definition’s unique identifier (txid).
    * **Request query:**
        * `reqId`: (required)
        * `identifier`: (required)
    * **Example**
        ```sh
          curl http://0.0.0.0:3708/api/networks/TEST_NETWORK/txs/revoc-reg-def/GKQKQjdtRo5RC12RpHTC4P:4:GKQKQjdtRo5RC12RpHTC4P:3:CL:299:photo_id_revokable:CL_ACCUM:ef788d60-82d2-4076-ac74-3b8ebd46da68/?reqId=1514311352551755&identifier=MSjKTWkPLtYoPEaTF1TUDb
        ```
    * **Response:**
        * **JSON:**
        ```json
        {
          "op": "REPLY",
          "result": {
            "type": "115",
            "identifier": "MSjKTWkPLtYoPEaTF1TUDb",
            "reqId": "1514311352551755",
            "seqNo": 301,
            "txnTime": 1690590785,
            "state_proof": {

            }
          },
          "data": {
            "credDefId": "GKQKQjdtRo5RC12RpHTC4P:3:CL:299:photo_id_revokable",
            "id": "GKQKQjdtRo5RC12RpHTC4P:4:GKQKQjdtRo5RC12RpHTC4P:3:CL:299:photo_id_revokable:CL_ACCUM:ef788d60-82d2-4076-ac74-3b8ebd46da68",
            "revocDefType": "CL_ACCUM",
            "tag": "ef788d60-82d2-4076-ac74-3b8ebd46da68",
            "value": {
              "issuanceType": "ISSUANCE_BY_DEFAULT",
              "maxCredNum": 1000,
              "publicKeys": {
                "accumKey": {
                  "z": "1 070E1B39601EA6157F4D21DE9896075CD3C35B2CD5B021769C89D14A2A118936 1 19D6564D67CE53F18E6D308DA4041EF519A30801C88718E2E12B717B745C7D33 1 1329F6B3C0C4D26206B80E9C91160835C1D42179ABBF1BDDDDFA8D36CF540B8B 1 178FE51D06194587B0A42CE6B48034D9C0687FCFB75A5A9DE4E7643ECEC6B42C 1 248FC53C6A479AF5B9AB4A7BF6F869D7A3D88C57CF197D3CAF9E0C18F215F67E 1 216D744DB04BEC4BCA979BFBFFFC146E9700413C46B89E076A1BEA7DCAED73C5 1 0ABA18AE0B338680CCF4E0919201707331569B80F71D03CB76382F4147D1814C 1 217D7C80BF9C9FDA1F65AAC9D310F40DB32A107A839FD1018538B8986208064B 1 06182EA221C9E8FED88E06E199FA44391DA0B43E8498EDCD8A3D4DB5CE15CC4F 1 1181C841EB5E472ED380C7037C4DED251596E88F3D28B16E7910315E6FEE3CF5 1 0A25810504B5AA732AC5EFAD601071DF220819CA4ED554E2496023A5EC69AA0A 1 13EB55F7E0D2805CBB48648650A370338E540973416A1E78C0F327B1A219673B"
                }
              },
              "tailsHash": "4ZpAkyEg7xA6HADcpfuCkyUMLvU8m3hgAu2eWmffZETC",
              "tailsLocation": "https://tails.vonx.io/GKQKQjdtRo5RC12RpHTC4P:4:GKQKQjdtRo5RC12RpHTC4P:3:CL:299:photo_id_revokable:CL_ACCUM:ef788d60-82d2-4076-ac74-3b8ebd46da68"
            }
          }
        }
        ```
#### GET_REVOC_REG
#### GET_REVOC_REG_DELTA
#### GET_AUTH_RULE
#### GET_TRANSACTION AUTHOR_AGREEMENT
#### GET_TRANSACTION_AUTHOR_AGREEMENT_AML
#### GET_CONTEXT
