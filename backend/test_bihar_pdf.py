import json
from extractor import analyze_legal_document

BIHAR_TEXT = """The State Of Bihar vs Ram Naresh Pandey(With Connected ... on 31 January, 1956
PETITIONER:
THE STATE OF BIHAR
Vs.
RESPONDENT:
RAM NARESH PANDEY(With Connected Appeal)
DATE OF JUDGMENT:
31/01/1956

ACT:
Criminal law-Prosecution-Application for withdrawal by Public -Prosecutor-Consent of Court-Function of the Court in giving such consent-Case triable by a Court of Session Whether application for withdrawal does not lie in the committal stage Tried judgment, Meaning of-Code of Criminal Procedure, 1898 (Act V of 1898), s. 494.

HEADNOTE:
By s. 494 Of the Code of Criminal Procedure, 1898: Any Public Prosecutor may, with the consent of the Court, in cases tried by jury before the return of the verdict, and in other cases before the judgment is pronounced, withdraw from the prosecution of any person either generally or in respect of any one or more of the offences for which he is tried.

The prosecution of M. and others was launched on the first information of the first respondent, and when the matter was pending before the Magistrate in the committal stage and before any evidence was actually taken, an application for the withdrawal of M. from the prosecution was made by the Public Prosecutor under s. 494 Of the Code of Criminal Procedure on the ground that on the evidence available it would not be just and expedient to proceed with the prosecution of M. The Magistrate was of the opinion that there was no reason to withhold the consent that was applied for and accordingly he discharged the accused. This order was upheld by the Sessions judge, but on revision, filed by the respondents, the High Court set aside the order and directed the Magistrate to record the evidence and then consider whether it established a Prima facie case against the accused.

Appeals by special leave from the judgment and order dated May 31, 1955, of the Patna High Court in Criminal Revision No. 102 of 1955, arising out of the judgment and order dated January 10, 1955, of the Court of the Sessions Judge of Manbhum-Singhbhum of Purulia in Criminal Re-vision No. 43 of 1954.

Mahabir Prasad, Advocate-General of Bihar, Tarakeshwar Nath and S. P. Verma, for the appellant in Appeal No. 53, H. J. Umrigar and A. G. Ratnaparkhi, for the appellant in Appeal No. 54.
Jai Gopal Sethi and Govind Saran Singh, for the respondents in Appeal No. 53 and for respondents Nos. 1 and 2 in Appeal No. 54.

1957. January 31. The Judgment of the Court was delivered by JAGANNADHADAS J.-These appeals arise out of an order of discharge passed by the Subordinate Judge-Magistrate of Dhanbad under s. 494 of the Code of Criminal Procedure on his consenting to the withdrawal of the Public Prosecutor from a prosecution pending before him in so far as it was against the appellant Mahesh Desai, one of the accused therein. The prosecution was launched on the first information of one Ram Naresh Pandey as against 28 persons about the commission of the murder of one Nand Kumar Chaubey, a peon of a colliery in Bagdigi, committed in the course of a serious riot on February 20, 1954.

The application for withdrawal as against the appellant was made on December 6, 1954, when the matter was pending before the Magistrate in the committal stage and before any evidence was actually taken. It was made by the Public Prosecutor on the ground that on the evidence available it would not be just and expedient to proceed with the prosecution of Sri Mahesh Desai and that therefore it was necessary to withdraw the case against Sri Mahesh Desai only.

We are, therefore, clearly of the opinion, for all the above reasons, that the order of the High Court should be set aside and the appeals allowed. Accordingly, the order of the trial court is hereby restored."""

res = analyze_legal_document(BIHAR_TEXT, 'The_State_Of_Bihar_vs_Ram_Naresh_Pandey.pdf')
print(json.dumps(res, indent=2))
