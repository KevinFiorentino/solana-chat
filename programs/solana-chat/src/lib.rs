use anchor_lang::prelude::*;

declare_id!("AH5pQMYm4HzbMfw6CTbWS1rVFHgGpKKz53qQPH7a7pZ3");

#[program]
pub mod solana_chat {

    use super::*;

    pub fn create_message(
        ctx: Context<CreateMessage>,
        text: String
    ) -> Result<()> {

        let message = &mut ctx.accounts.message;
        let clock: Clock = Clock::get().unwrap();

        message.owner = ctx.accounts.user.key();
        message.text = text;
        message.timestamp = clock.unix_timestamp;

        Ok(())
    }

    pub fn update_message(
        ctx: Context<UpdateMessage>,
        text: String
    ) -> Result<()> {

        let message = &mut ctx.accounts.message;

        message.text = text;

        Ok(())
    }

    pub fn delete_message(
        ctx: Context<DeleteMessage>,
    ) -> Result<()> {
        Ok(())
    }

}


#[derive(Accounts)]
#[instruction(text: String)]
pub struct CreateMessage<'info> {
    #[account(
        init,
        payer = user,
        space = 8  +                             // Discriminator Anchor
                32 +                             // Owner
                text.as_bytes().len() + 4 +      // Text + 4    (String prefix)
                8                                // Timestamp
    )]
    pub message: Account<'info, Message>,

    #[account(mut)]
    pub user: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(text: String)]
pub struct UpdateMessage<'info> {
    #[account(
        mut,
        realloc = 8  +
                  32 +
                  text.as_bytes().len() + 4 +
                  8,
        realloc::payer = user,
        realloc::zero = true                // The account will be updated multiple times either shrinking or expanding the space allocated
    )]
    pub message: Account<'info, Message>,

    #[account(mut)]
    pub user: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct DeleteMessage<'info> {       
    #[account(
        mut,
        close = user                        // TODO: Validate owner account (has_one)
    )]
    pub message: Account<'info, Message>,

    #[account(mut)]
    pub user: Signer<'info>,
}

#[account]
#[derive(Default)]
pub struct Message {
    pub owner: Pubkey,    // 32
    pub text: String,     // n + 4
    pub timestamp: i64,   // 8
}
