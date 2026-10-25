#!/usr/bin/env python3
"""Build the playable lesson pack from the authored 60-day course outline."""

import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
COURSE_PATH = ROOT / "curriculum.json"
MISSION_PATH = ROOT / "missions.json"

# Each row: field-guide lesson, fictional situation, takeaway, safe practice,
# completion check. Actions are restricted to personal settings or supplied
# fictional artifacts; the app never reaches a real system.
LESSONS = {
    8: (
        "A sign-in starts with an identity claim, such as an account name. Authentication checks evidence for that claim. Authorization is a separate decision about what the signed-in person may do.",
        "A fictional club dashboard shows the name of a volunteer who has just signed in. The dashboard has not yet checked whether that volunteer may edit the membership list.",
        "A successful sign-in proves an account claim; a separate permission check must control each protected action.",
        "On the supplied diagram, mark the sign-in check and the separate permission check before the member list can be edited.",
        "Confirm the diagram has an authentication step and an authorization check on the edit action; do not treat the display name as permission.",
    ),
    9: (
        "A passkey uses a key pair: the service stores a public key, while the private key stays protected by your device or password manager. The sign-in is bound to the intended service, which helps resist look-alike login pages.",
        "A fictional learning portal offers passkeys. A message also links to a page that asks learners to type their existing password to ‘move’ it.",
        "Create or use a passkey through the service’s verified app or website; never type an existing password into an unsolicited migration page.",
        "Read the fictional setup choices and identify the route that stays inside the portal’s official account settings.",
        "Check that the setup began inside the portal you opened yourself and that no password or recovery code was requested by the lesson.",
    ),
    10: (
        "Multi-factor authentication combines different kinds of proof. A passkey or security key can resist phishing better than an approval prompt; never approve a request you did not start.",
        "A fictional account receives repeated sign-in approval prompts while its owner is not trying to sign in.",
        "Deny unexpected prompts, secure the account through its official settings, and choose a strong available second factor.",
        "In the mock account screen, compare the listed sign-in factors and select the strongest option the account actually supports.",
        "Verify the mock setting shows the selected factor and that every unexpected prompt was denied, not approved.",
    ),
    11: (
        "Recovery channels can become an alternate route into an account. Keep them current, protected, and under your control; recovery codes should be stored privately and separately from the account they recover.",
        "A fictional student changes phone numbers but still has the old number listed for account recovery.",
        "Review recovery methods from the service’s official settings and remove channels you no longer control.",
        "Use the mock settings panel to identify which recovery channel is stale before choosing a safe update plan.",
        "Check that the plan uses only a channel the account owner controls and does not expose recovery codes in notes or messages.",
    ),
    12: (
        "Least privilege gives each person or app only the access required for its task, for only as long as needed. A broad role is not a substitute for checking what the task actually requires.",
        "A fictional design volunteer needs to upload one approved poster but is offered administrator access to the entire club workspace.",
        "Choose the narrowest permission that allows the approved task and review it when the task ends.",
        "In the role cards, match the poster upload task to a limited upload permission rather than workspace administration.",
        "Verify that the chosen role cannot manage members, billing, or unrelated club files.",
    ),
    13: (
        "A session is an active sign-in on a device or browser. Review sessions after a lost device, suspicious alert, or shared-device use; sign out only sessions you recognize as no longer needed.",
        "A fictional account lists a current laptop session and an old library-computer session that the owner recognizes as finished.",
        "Use the service’s official session list to end sessions you no longer need, then secure the account if any session is unfamiliar.",
        "In the mock session list, select only the expired shared-computer session for sign-out.",
        "Confirm the expired session is no longer listed while the owner’s current trusted session remains available.",
    ),
    14: (
        "An access review compares people, devices, roles, and current responsibilities. Remove access through the approved owner when it is no longer needed; do not infer misconduct from an unfamiliar name alone.",
        "A fictional team roster has one former volunteer whose project access was never reviewed after the project ended.",
        "Confirm the person’s current role with the authorized owner, then request a proportionate access change and record the reason.",
        "Review the supplied roster and flag only entries whose stated role no longer matches the access shown.",
        "Check every proposed change against the role owner and keep the reason factual and limited to the project.",
    ),
    15: (
        "A device usually sends traffic through a local network and router before it reaches an internet service. The path and controls depend on the network; a diagram helps separate each boundary.",
        "A fictional learner is asked to draw how a phone reaches a course website through a home router.",
        "Trace the route as device, local network/router, internet path, and destination service; do not treat the path as proof that a destination is trustworthy.",
        "Label those four parts on the supplied blank network diagram.",
        "Verify that the drawing distinguishes the local router from the destination service and includes no real addresses or targets.",
    ),
    16: (
        "An IP address identifies a network endpoint for routing. A domain name is a human-readable name that is looked up through DNS; neither an address nor a familiar name proves that a service is legitimate.",
        "A fictional browser history shows learn.example and a sample address 192.0.2.24 in a teaching diagram.",
        "Describe the domain as a human-readable service name and the IP address as a routing address; verify a service through a trusted route.",
        "Sort the supplied fictional labels into ‘name’ and ‘network address’ without visiting any of them.",
        "Check that each label is classified by its role, not by whether it looks familiar or has a particular number pattern.",
    ),
    17: (
        "DNS helps a device look up the address associated with a domain name. A successful lookup answers a routing question; it does not authenticate the owner, safety, or intent of the destination.",
        "A fictional support page loads after a name lookup, but the message that linked to it is still unexpected.",
        "Treat DNS as name lookup, then verify the request and service independently before sharing information.",
        "On the provided flow card, place DNS between the domain name and the sample network address.",
        "Confirm the flow labels DNS as a lookup step and does not label a successful lookup as a safety check.",
    ),
    18: (
        "HTTPS uses TLS to protect a connection against some interception and tampering in transit. It does not prove the site’s claims are true, make a request appropriate, or guarantee that the site owner is trustworthy.",
        "A fictional urgent payment request opens a page with a lock icon and HTTPS in the address bar.",
        "Use HTTPS as one connection signal, but independently verify the service and request before entering payment or account information.",
        "Compare the page indicator with the message context and choose an independent verification route.",
        "Check that your decision weighs both the connection indicator and the unexpected payment request.",
    ),
    19: (
        "Network segmentation separates groups of devices so that access can be limited between them. A guest network is useful for visitors, but it is not a replacement for updates, strong router settings, or careful sharing.",
        "A fictional household wants visitors to use Wi-Fi without reaching the family file-sharing devices.",
        "Use a supported guest network and review its isolation setting so visitor devices do not share the trusted device network.",
        "On the mock router diagram, place visitor devices on the guest segment and personal devices on the trusted segment.",
        "Confirm that the diagram marks the boundary and does not imply that guest Wi-Fi protects against every risk.",
    ),
    20: (
        "A safer home Wi-Fi setup uses current router firmware, a unique administrator password, modern encryption supported by your devices, and a separate guest network when useful.",
        "A fictional router checklist shows an old firmware notice, a shared default administrator password, and an unused guest network.",
        "Review the router’s official settings, update through its management interface when appropriate, and replace default access details with unique ones.",
        "Prioritize the mock checklist items and mark the official router settings page as the only update route.",
        "Verify the plan addresses firmware, administrator access, and guest separation without exposing the router to the public internet.",
    ),
    21: (
        "A network diagram is a scoped description of devices and paths, not a live scan. Good diagrams identify trust boundaries and explain which systems are intentionally included.",
        "A fictional club asks a learner to review a supplied diagram containing a member laptop, guest Wi-Fi, router, and cloud mail service.",
        "Use only the supplied diagram, label trust boundaries, and ask the diagram owner about any unclear connection.",
        "Annotate the fictional diagram with device, guest network, router, and service labels.",
        "Check that every annotation refers to the supplied diagram and makes no claim about an unobserved real network.",
    ),
    22: (
        "Data classification helps people choose handling rules. Public material, internal working files, and sensitive records need different access and sharing decisions; collect and keep only what the task needs.",
        "A fictional project folder mixes a public poster, draft meeting notes, and a list containing private contact details.",
        "Classify each item before sharing and restrict sensitive material to people who need it for an approved task.",
        "Sort the fictional sample files into public, internal, and sensitive groups using their contents rather than their folder names.",
        "Confirm that the contact list is not placed in a public folder and that labels do not include unnecessary personal data.",
    ),
    23: (
        "App permissions should match the feature being used. Review access to location, contacts, camera, and files in the operating system; deny or revoke access that is not needed.",
        "A fictional flashlight app asks for contacts and location access before it can turn on the light.",
        "Grant only permissions that make sense for the app’s purpose, and review or revoke unnecessary access in device settings.",
        "Use the mock permission sheet to keep only the permission required for the stated feature.",
        "Check that every kept permission has a clear purpose and that no contact or location data is disclosed without need.",
    ),
    24: (
        "Security updates repair known weaknesses and improve reliability. Use the device or software’s built-in update settings or official publisher; ignore urgent download prompts from unexpected pages.",
        "A fictional browser pop-up claims a device is out of date and offers an installer, while the device’s settings show a normal update notice.",
        "Close the unsolicited pop-up and review updates through the operating system’s built-in settings.",
        "Choose the official update route on the mock device screen and note whether the device is still supported.",
        "Verify the update source is the device settings or publisher’s official channel, not the web pop-up.",
    ),
    25: (
        "Browser controls include site permissions, downloads, saved sign-ins, and security warnings. A lock icon protects the connection but does not prove a page is honest or appropriate.",
        "A fictional survey page asks for camera access and offers an unexpected file download before showing its questions.",
        "Pause, check the page’s purpose and source, and deny permissions or downloads that are not necessary.",
        "Review the mock browser permission list and allow only the permission required by the stated task.",
        "Confirm there is no unexpected download and that the page did not receive unrelated camera, location, or file access.",
    ),
    26: (
        "Backups help recover from loss, damage, or accidental changes. Keep a copy separate from the original device, protect access to it, and periodically restore a test file to confirm recovery works.",
        "A fictional student has project files on one laptop and sees a backup icon but has never checked a restore.",
        "Keep a separate trusted backup and test restoring a harmless sample file before relying on it.",
        "Use the mock recovery checklist to select a separate destination and a non-sensitive test file.",
        "Confirm the sample file opens from the backup and that the original remains unchanged.",
    ),
    27: (
        "If a device is lost, use the manufacturer’s or service’s official recovery route. Protect accounts, report the loss to the responsible owner, and use remote lock or erase only when authorized and appropriate.",
        "A fictional learner leaves a tablet on a bus; the tablet had access to school mail and shared notes.",
        "Use the official device-recovery service, secure affected accounts, and follow the school’s reporting process.",
        "Order the supplied lost-device actions by protecting access first and notifying the responsible owner promptly.",
        "Verify every step uses the owner’s official service and avoids sharing the device’s private contents in a public post.",
    ),
    28: (
        "A device review checks support status, updates, screen lock, app permissions, backups, and recovery options. Small scheduled reviews are easier to complete than a rushed cleanup after a problem.",
        "A fictional household has a supported phone, an old tablet, and a shared laptop with several saved sessions.",
        "Review each device’s support and access separately, then prioritize the most important account and recovery gaps.",
        "Complete the mock checklist for one device at a time and mark any unsupported device for a supported replacement plan.",
        "Check that the review includes updates, lock, permissions, backup, and recovery without collecting passwords.",
    ),
    29: (
        "Social engineering uses pressure, authority, secrecy, or urgency to influence a person. These cues do not prove a request is fraudulent, but they are reasons to slow down and verify independently.",
        "A fictional caller claims to be a senior club officer and asks a volunteer to keep a payment request secret until the end of the hour.",
        "Pause when a request creates urgency or secrecy and verify it through a separate trusted contact route.",
        "Mark the pressure cues in the fictional dialogue, then choose a neutral question that does not reveal private information.",
        "Verify the request with the named person using contact details already known to the club.",
    ),
    30: (
        "Out-of-band verification uses a different trusted channel from the one that carried an unusual request. Do not reuse phone numbers, links, or contact details supplied only in the unexpected message.",
        "A fictional supplier email asks for a bank-detail change and includes a new phone number for ‘confirmation’.",
        "Pause the change and contact the supplier through a previously verified number or established portal.",
        "Select the contact method in the mock vendor record that was saved before the email arrived.",
        "Confirm the request with the known contact and record who approved the change before proceeding.",
    ),
    31: (
        "Data minimization means collecting and sharing only what is needed for a clear purpose. Consent should explain what is collected, why, who receives it, and how long it is kept.",
        "A fictional event form asks for a birth date, home address, and identity document to send a public schedule.",
        "Remove fields that are not needed to send the schedule and explain any remaining collection clearly.",
        "Edit the fictional form to keep only the information required to deliver the schedule.",
        "Check that each remaining field has a stated purpose and that the form does not request sensitive data without need.",
    ),
    32: (
        "File-sharing settings define who can view or edit information. Check the recipients, access level, and link scope before sharing; links that work for anyone can spread beyond the intended group.",
        "A fictional team folder with draft membership notes is set to ‘anyone with the link can edit.’",
        "Restrict the folder to named people who need it, choose the least access required, and review the recipient list.",
        "Change the mock sharing card from public editing to named-reader access for the approved reviewers.",
        "Verify the public link is disabled and only the intended people retain the access needed for their task.",
    ),
    33: (
        "A useful report states what was observed, when it happened, and what action was taken. Use the organization’s approved reporting route; avoid accusations, speculation, and broad forwarding.",
        "A fictional learner receives an unexpected sign-in alert and is unsure whether it belongs to their account.",
        "Use the service’s report or support route and include factual details without clicking the alert’s links.",
        "Select the official report path in the mock service and draft a short report with the time and observed message.",
        "Check that the report contains observable facts, no passwords or codes, and no unsupported claim about who caused it.",
    ),
    34: (
        "Useful evidence is relevant, factual, and handled with care. Preserve an original where policy allows, note the time and source, and limit access; do not alter or spread sensitive material casually.",
        "A fictional moderator must document an inappropriate message in a private club space without forwarding it to the entire membership.",
        "Follow the platform’s approved reporting process and preserve only the minimum relevant record for the responsible reviewer.",
        "Choose the mock report artifact that records time, source, and the relevant excerpt while hiding unrelated member details.",
        "Confirm the original remains unchanged and access is restricted to the people responsible for review.",
    ),
    35: (
        "A privacy response should reduce unnecessary exposure, notify the right owner, and preserve enough facts to understand what happened. Avoid blame until evidence and responsibilities are reviewed.",
        "A fictional club member discovers that a sign-up spreadsheet was visible to more people than intended.",
        "Restrict access through the authorized owner, record the scope and time, and follow the club’s privacy reporting process.",
        "Use the mock incident form to capture the file, visibility setting, discovery time, and owner without copying the list.",
        "Verify access is narrowed, the owner is informed, and the note contains no unnecessary member data.",
    ),
    36: (
        "An event log can show a timestamp, actor, action, resource, and outcome. Logs describe recorded events; they may be incomplete and do not automatically explain intent.",
        "A fictional sign-in log contains a time, a masked account label, an action, and a success or failure result.",
        "Read each field separately and describe only what the record actually shows.",
        "Label the timestamp, actor, action, resource, and outcome in the supplied sample log.",
        "Check that your summary distinguishes recorded facts from explanations that the log does not provide.",
    ),
    37: (
        "A baseline is a reference for expected activity in a defined context. Compare like with like, consider schedule and role changes, and ask the account owner before treating an unusual event as malicious.",
        "A fictional staff member signs in earlier than usual during an announced schedule change.",
        "Compare the event with the person’s role and known context before deciding whether it needs escalation.",
        "Sort the supplied sample events into expected, unusual-but-explained, and needs-review groups.",
        "Verify that each classification has a stated context or is clearly marked as uncertain.",
    ),
    38: (
        "A sign-in alert is one signal. Check whether the user recognizes the activity, whether a request was initiated, and whether the service provides a trusted way to review sessions.",
        "A fictional account owner receives a sign-in alert while away from their usual devices and says they did not start it.",
        "Do not approve the request; contact the owner through an approved route and review the account using official settings.",
        "Triage the mock alert by recording the user’s response, time, and official next step.",
        "Confirm the action is limited to the account owner’s service and that the alert was not approved.",
    ),
    39: (
        "Signal quality depends on evidence, context, and uncertainty. Record confidence separately from impact, and seek another data point before making a high-impact conclusion.",
        "A fictional monitoring queue contains one unfamiliar location label, but the event record is missing device and user context.",
        "Mark the evidence as incomplete, seek the approved context, and avoid presenting a guess as a confirmed incident.",
        "For each supplied alert, write one observed fact and one unanswered question.",
        "Check that your confidence label matches the available evidence and records missing information explicitly.",
    ),
    40: (
        "Alert priority should reflect potential impact, urgency, scope, and confidence—not the number of alerts alone. Escalate through the team’s defined route when impact or authority exceeds your role.",
        "A fictional queue shows one low-impact repeated reminder and one credible alert affecting an account with access to sensitive records.",
        "Prioritize the event with the greater credible impact and follow the escalation rules for that role.",
        "Rank the fictional queue using impact, urgency, scope, and confidence labels.",
        "Verify that priority has a stated reason and does not rely only on alert volume or alarming wording.",
    ),
    41: (
        "A concise incident note separates observed facts, actions, open questions, and the next owner. Use neutral wording, exact times where available, and only the minimum identifying information needed.",
        "A fictional analyst needs to hand off an unresolved account alert to the next shift.",
        "Write a factual handoff with the event time, verified action, current status, open question, and named next owner.",
        "Complete the mock handoff template using only the facts supplied in the case.",
        "Check that the note avoids speculation and names a next action and owner.",
    ),
    42: (
        "Triage combines evidence, context, impact, and a proportionate action. A single alert rarely answers every question; keep a clear record of what is known and what remains uncertain.",
        "A fictional exercise gives a sign-in event, a user response, and one missing context field for review.",
        "Record the facts, request the missing context through the approved owner, and choose an action within the analyst’s authority.",
        "Sort the provided case cards into ‘known’, ‘needs confirmation’, and ‘next authorized action’ columns.",
        "Verify each action is supported by a stated fact and a named owner.",
    ),
    43: (
        "A threat model starts with a feature’s purpose, users, data, trust boundaries, and possible failures. It helps a team choose safeguards before building; it is not a recipe for attacking a real system.",
        "A fictional club app will let members upload event photos and choose who can view them.",
        "Map the data, users, access boundary, and likely failure cases before choosing controls.",
        "Fill in the supplied feature canvas with data, users, trust boundary, and one privacy or availability concern.",
        "Check that every proposed safeguard links to a stated risk and remains within the fictional design exercise.",
    ),
    44: (
        "Input validation checks that data matches the feature’s expected format, length, and allowed values. Treat user input as data; validation helps prevent mistakes but does not replace authorization or safe output handling.",
        "A fictional event form expects a date, a short title, and a category selected from three approved options.",
        "Define clear allowed formats and reject values outside the feature’s stated purpose with a helpful message.",
        "Write validation rules for the mock title length, date format, and category choices.",
        "Check that each field has a boundary and that the lesson never asks you to submit the data to a real service.",
    ),
    45: (
        "Authentication identifies a signed-in account; authorization decides whether that account may perform a particular action on a particular resource. Protected actions need a permission check at the trusted service, not only a hidden button in the app.",
        "A fictional app hides its ‘delete event’ button for ordinary members, but the service still needs to check who makes a delete request.",
        "Require the trusted service to verify the account’s permission for every protected action and resource.",
        "On the supplied flow diagram, place an authorization check at the service boundary before the delete action.",
        "Verify the rule is enforced even if a client interface is changed or the button is not visible.",
    ),
    46: (
        "Secrets such as API keys and signing credentials should not be placed in public code, sample screenshots, or logs. Use an approved secret store and restrict who or what can read each value.",
        "A fictional code review finds a placeholder configuration file that contains a string labeled as a private service key.",
        "Do not copy or use the value; remove it from the example, rotate it through the authorized owner if it was real, and use a secret store.",
        "In the mock configuration, identify the field that must be replaced by a secret-store reference.",
        "Check that no secret value appears in the example, logs, or public notes after the review.",
    ),
    47: (
        "Cloud identity and access management assigns roles to people or services. Give each role only the actions it needs, review inherited access, and keep storage private unless public access is intentional and approved.",
        "A fictional photo-processing service needs to read one upload folder but is offered administrator access to the entire cloud project.",
        "Choose a narrow role scoped to the needed folder and confirm the storage policy with its authorized owner.",
        "Match the mock service to the least-privilege role and resource scope in the access table.",
        "Verify the role cannot manage users, billing, or unrelated storage.",
    ),
    48: (
        "Secure defaults protect users before they customize an app. Private sharing, minimal permissions, and safe session behavior should be the starting state, with clear choices when a different setting is needed.",
        "A fictional new workspace makes every uploaded file visible to anyone with a link unless a member changes it.",
        "Set the default to named-member access and make any broader sharing an explicit, reviewable choice.",
        "Choose the safer initial values on the mock setup screen before any member uploads a file.",
        "Verify a new workspace starts with restricted access and explains how an owner can deliberately change it.",
    ),
    49: (
        "A configuration review checks settings against a stated purpose, owner, and approved baseline. Record the finding and rationale; avoid changing production settings unless the owner authorizes the change.",
        "A fictional review checklist shows a public storage setting that conflicts with the project’s private-file requirement.",
        "Document the mismatch, notify the owner, and follow the approved change process rather than editing an unknown environment.",
        "Compare each mock setting with the supplied baseline and mark only evidence-backed differences.",
        "Confirm each recommendation names the setting, expected state, owner, and approval path.",
    ),
    50: (
        "An incident response starts with recognizing a concern and using the approved reporting route. Do not investigate beyond your role; preserve basic facts and contact the person responsible for the system.",
        "A fictional employee sees repeated account alerts and a file-sharing change they did not make.",
        "Report the observations promptly through the organization’s approved route and follow the owner’s instructions.",
        "Choose the mock report form and record times, affected service, and the user’s statement.",
        "Verify the report includes observations rather than conclusions and is assigned to a responsible owner.",
    ),
    51: (
        "Impact assessment considers which accounts, people, data, and services may be affected, how severe the effect is, and what evidence supports that scope. Start with known facts and update the assessment as information changes.",
        "A fictional alert may affect one shared club folder, but the report does not yet identify who could view it.",
        "Determine the known data and access scope with the folder owner before choosing a broader response.",
        "Complete the mock impact table with affected resource, known users, potential data, and missing information.",
        "Check that impact is described proportionately and uncertain scope stays marked as unknown.",
    ),
    52: (
        "Containment reduces ongoing harm but must respect authority and preserve needed evidence. Choose a reversible, proportionate action within your role and escalate changes that require an owner.",
        "A fictional moderator can temporarily disable a public share link but is not authorized to delete the project folder.",
        "Use the approved temporary access control, preserve the relevant record, and notify the folder owner.",
        "Select the least disruptive action available to the moderator in the supplied response options.",
        "Verify the action is authorized, scoped to the exposed share, and recorded for the owner.",
    ),
    53: (
        "A timeline orders observable events with timestamps and sources. Keep the original order and note gaps; do not fill missing times with guesses or assume that sequence alone proves causation.",
        "A fictional case file contains a message at 09:10, a user report at 09:22, and an account setting change with no confirmed time.",
        "Record confirmed times and sources, label the unknown time as unknown, and avoid inferring who caused the change.",
        "Arrange the supplied event cards by confirmed timestamp and mark the undated event separately.",
        "Check that the final timeline preserves sources and explicitly labels gaps and uncertainty.",
    ),
    54: (
        "Recovery restores a known-good service or data state and then verifies that normal operation and access controls work. Keep a backup or recovery copy protected and involve the owner for actions beyond your role.",
        "A fictional team restores a shared document from yesterday’s backup after an accidental edit.",
        "Restore a test copy first, compare it with the expected content, then ask the owner to approve any production recovery.",
        "Follow the mock recovery checklist from protected backup through test restore and owner verification.",
        "Confirm the restored copy is readable, permissions remain appropriate, and the source backup is retained safely.",
    ),
    55: (
        "Incident communication should be timely, factual, and appropriate for its audience. Share confirmed impact and next steps through approved channels; do not speculate, expose sensitive details, or promise an outcome that is not known.",
        "A fictional service team needs to tell members that a shared folder is temporarily restricted while its owner checks access history.",
        "State what is confirmed, what action is underway, where updates will appear, and what members should do now.",
        "Draft a short mock update using only the facts supplied in the scenario.",
        "Review the message for speculation, unnecessary personal data, and a clear next update owner.",
    ),
    56: (
        "An after-action review looks for contributing conditions and improvements, not a person to blame. Assign each improvement an owner and a check date so the lesson leads to a real process change.",
        "A fictional team discovers that shared-link settings were unclear and no one owned the access review.",
        "Describe the process gap, agree on a practical change, assign an owner, and schedule a follow-up check.",
        "Complete the mock review with one contributing condition, one improvement, one owner, and one due date.",
        "Verify the improvement is specific and the follow-up checks whether it actually worked.",
    ),
    57: (
        "A capstone begins with written scope, goals, roles, and stop conditions. A clear boundary keeps the exercise safe and makes the result measurable.",
        "A fictional tabletop exercise covers one mock club account, three sample alerts, and a response decision; no external system is involved.",
        "State the included artifacts, learning objective, decision owner, and explicit stop conditions before starting.",
        "Fill in the mock exercise charter with scope, roles, success criteria, and what the exercise will not touch.",
        "Confirm every participant can identify the boundary and the person who can pause the simulation.",
    ),
    58: (
        "Investigation connects evidence only when sources and times support the relationship. Keep facts, interpretations, and open questions separate; a sequence of events alone does not prove cause.",
        "The fictional capstone includes a payment message, a denied sign-in prompt, and a folder-sharing change reported by an owner.",
        "Build a sourced timeline, identify what is confirmed, and list the questions that still need an authorized owner.",
        "Place each supplied artifact on the timeline and attach its source and confidence label.",
        "Check that no event is attributed to a person without evidence and that missing context is visible.",
    ),
    59: (
        "A good response is proportionate to impact and authority. Protect people and information, preserve the relevant record, communicate through the right owner, and explain why each step is appropriate.",
        "A fictional capstone owner confirms a share link was too broad, while the sign-in alert remains unverified.",
        "Restrict the confirmed share, report the unverified alert for review, and avoid claiming the events share a cause.",
        "Choose and order the mock response actions, then write one sentence explaining the evidence for each.",
        "Verify that every action is within the assigned role and distinguishes the confirmed issue from the open question.",
    ),
    60: (
        "A field review demonstrates habits, not expert status: explain core concepts, make a proportionate choice, keep a factual record, and recognize when to ask an authorized owner. A course score is not a professional certification.",
        "The final fictional case combines an unexpected request, an account alert, a shared-data concern, and a recovery decision.",
        "Show your reasoning, identify uncertainty, choose safe defensive steps, and state when an owner or qualified specialist must take over.",
        "Complete the final decision set and write a concise debrief with evidence, action, remaining uncertainty, and next owner.",
        "Review the debrief against those four parts; the course completion records demonstrated foundations, not expert or job readiness.",
    ),
}

MISCONCEPTIONS = {
    "identity": (
        "A display name or successful sign-in automatically grants every permission.",
        "A recovery prompt or approval request should be accepted whenever it appears.",
    ),
    "networks": (
        "A familiar name, strong signal, lock icon, or successful lookup proves the service is trustworthy.",
        "The fastest route is always the safest route, even if the network owner is unknown.",
    ),
    "devices": (
        "Grant every permission and install any update notice that appears in a pop-up.",
        "A backup icon or working device proves recovery and support are available.",
    ),
    "people-data": (
        "Urgency is proof that a request is authentic and should stay secret.",
        "Public sharing is fine whenever a link is difficult to guess.",
    ),
    "monitoring": (
        "One event proves intent, and an alert label gives the full context.",
        "A guess can be written as a confirmed fact when a decision is needed quickly.",
    ),
    "secure-build": (
        "A hidden client button replaces a permission check at the trusted service.",
        "A private-looking sample or log is a safe place to paste a real secret.",
    ),
    "response": (
        "Responders may make any change or delete evidence if an alert looks serious.",
        "A timeline proves cause, and a public update should include every detail.",
    ),
    "capstone": (
        "A course score proves specialist expertise or authorizes work on real systems.",
        "An unresolved question should be hidden so the final report sounds confident.",
    ),
}

ACTION_DISTRACTORS = (
    "Follow the most urgent-looking prompt before checking its source or the owner.",
    "Share the full artifact publicly so other people can decide what to do.",
)
CHECK_DISTRACTORS = (
    "Assume the outcome succeeded because a button or instruction was displayed.",
    "Write an assumption as a confirmed fact and skip the follow-up owner.",
)
OPENING_PRACTICE = {
    1: "On the fictional parcel message, mark the pressure cue and write the independent route you would use; do not open its link.",
    2: "Review the sign-in and recovery options on one of your own accounts; do not write down or share a password or code.",
    3: "Use the café scenario to list two checks you would make before connecting; do not join an unknown network for this exercise.",
    4: "Remove unnecessary fields from the supplied fictional sign-up form and explain what the service actually needs.",
    5: "Check whether your own device has an official update waiting; do not install anything from a pop-up or unfamiliar page.",
    6: "If you have a backup, restore a harmless test file; otherwise make a simple plan for one important file.",
    7: "Annotate the supplied fictional evidence with time, source, and what remains unknown; do not add personal data.",
}

FINAL_REVIEW = [
    ("A message asks for an unexpected fee. What is the safest response?", "Verify through a service route you choose independently before taking action.", ("Open the message link because the logo looks familiar.", "Forward it with personal details so others can decide."), "Independent verification avoids trusting a link supplied by the unexpected request."),
    ("A sign-in prompt appears that you did not start. What should you do?", "Deny it and review the account using its official settings.", ("Approve it to clear the notification.", "Send its code to someone offering to help."), "Do not approve sign-ins you did not start or share one-time codes."),
    ("A shared folder contains more information than a reviewer needs. What is the safer action?", "Ask the owner to restrict access and remove unnecessary information.", ("Make the folder public so review is faster.", "Copy the full folder into a personal account."), "Limit access and data to the approved task and intended people."),
    ("What belongs in a useful case note?", "Observed facts, source and time, actions taken, open questions, and a next owner.", ("A guess written as a confirmed cause.", "Passwords and recovery codes for later review."), "A factual note distinguishes evidence from uncertainty and avoids secrets."),
    ("What does a passed 60-day course demonstrate?", "A checked foundation in beginner defensive decisions, not expert status or professional certification.", ("Guaranteed expert readiness for every cybersecurity role.", "Authorization to inspect any network or account."), "The capstone records course learning; expertise and authorization require much more."),
]


def rotate_answer(correct: str, distractors: tuple[str, str], day: int) -> tuple[list[str], int]:
    choices = [correct, *distractors]
    answer = day % len(choices)
    choices[0], choices[answer] = choices[answer], choices[0]
    return choices, answer


def question(prompt: str, correct: str, distractors: tuple[str, str], explanation: str, day: int) -> dict:
    options, answer = rotate_answer(correct, distractors, day)
    return {"prompt": prompt, "options": options, "answer": answer, "explanation": explanation}


def main() -> None:
    course = json.loads(COURSE_PATH.read_text(encoding="utf-8"))
    pack = json.loads(MISSION_PATH.read_text(encoding="utf-8"))
    existing = {mission["id"]: mission for mission in pack["missions"]}
    module_by_day = {
        day["day"]: (module, day)
        for module in course["modules"]
        for day in module["days"]
    }

    for number, (lesson, scenario, takeaway, practice, verification) in LESSONS.items():
        module, day = module_by_day[number]
        mission_id = day.get("mission_id") or f"day-{number:02d}-{module['id']}"
        day["mission_id"] = mission_id
        if mission_id in existing:
            existing[mission_id].setdefault("practice", practice)
            if number == 60 and len(existing[mission_id].get("questions", [])) < 8:
                for offset, (prompt, correct, distractors, explanation) in enumerate(FINAL_REVIEW, start=3):
                    existing[mission_id]["questions"].append(
                        question(prompt, correct, distractors, explanation, number + offset)
                    )
            continue
        key = module["id"]
        first_wrong, second_wrong = MISCONCEPTIONS[key]
        title = day["title"]
        existing[mission_id] = {
            "id": mission_id,
            "day": number,
            "title": title,
            "category": module["title"].upper(),
            "tone": "green" if number % 3 == 0 else "orange" if number % 3 == 1 else "purple",
            "difficulty": "Starter" if number < 15 else "Explorer" if number < 36 else "Analyst" if number < 57 else "Checkpoint",
            "duration": "15 min" if number == 60 else "8 min",
            "xp": 50 if number < 57 else 80,
            "description": day["objective"],
            "lesson": lesson,
            "takeaway": takeaway,
            "practice": practice,
            "scenario": scenario,
            "questions": [
                question(
                    f"Which principle best fits: {title}?",
                    takeaway,
                    (first_wrong, second_wrong),
                    f"{takeaway} This is the core idea to carry into the next case.",
                    number,
                ),
                question(
                    "What is the safest next move in this situation?",
                    practice,
                    ACTION_DISTRACTORS,
                    f"{practice} Keep the decision within the stated personal or fictional scope.",
                    number + 1,
                ),
                question(
                    "How should you verify the task was handled responsibly?",
                    verification,
                    CHECK_DISTRACTORS,
                    f"{verification} A useful record distinguishes what was checked from what is still unknown.",
                    number + 2,
                ),
            ],
        }
        if number == 60:
            for offset, (prompt, correct, distractors, explanation) in enumerate(FINAL_REVIEW, start=3):
                existing[mission_id]["questions"].append(
                    question(prompt, correct, distractors, explanation, number + offset)
                )

    for number, practice in OPENING_PRACTICE.items():
        day = module_by_day[number][1]
        existing[day["mission_id"]].setdefault("practice", practice)

    pack["missions"] = sorted(existing.values(), key=lambda mission: mission.get("day", 0))
    course["program"]["available_days"] = 60
    course["program"]["daily_minutes"] = 15
    course["program"]["promise"] = (
        "A structured 60-day beginner path with short lessons, safe fictional practice, recall checks, and a final defensive assessment."
    )
    course["program"]["outcome"] = (
        "Demonstrate cybersecurity foundations and beginner defensive workflows. This is not an employment promise or professional certification."
    )

    COURSE_PATH.write_text(json.dumps(course, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    MISSION_PATH.write_text(json.dumps(pack, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Built {len(pack['missions'])} lessons across {course['program']['duration_days']} course days.")


if __name__ == "__main__":
    main()
